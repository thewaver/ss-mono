import { createEffect, createSignal } from "solid-js";

import { type GradientHandTrailOpts, type PointerReading, SVGDefsUtils } from "@thewaver/ss-components";
import {
    HandTrail1Const,
    HandTrailConst,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { MathUtils, SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

type HandStamp = {
    angle: number;
    fade: number;
    bornMs: number;
};

const NO_REF = () => undefined;

const getShortestTurn = (from: number, to: number) => {
    const gap = (((to - from) % HandTrailConst.FULL_TURN) + HandTrailConst.FULL_TURN) % HandTrailConst.FULL_TURN;

    return gap > HandTrailConst.HALF_TURN ? gap - HandTrailConst.FULL_TURN : gap;
};

const getSweepRotation = (angle: number, arc: number) => angle - HandTrailConst.HALF_TURN - arc * 0.5;

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const clock = SVGDefsSolidUtils.createClock(TrailStampConst.TRAIL_LIFETIME_MS);

const createHandStamp = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    opts?: GradientHandTrailOpts,
) => {
    const [getStamp, setStamp] = createSignal<HandStamp>();

    let bornTick: number | undefined;
    let lastAngle: number | undefined;
    let lastTurnedMs: number | undefined;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const angle = reading.angle;
        const fade = SVGDefsUtils.getPointerFade(reading, getIsPointerPresent());
        const turn = lastAngle !== undefined ? Math.abs(getShortestTurn(lastAngle, angle)) : undefined;

        lastAngle = angle;

        if (turn !== undefined && turn > HandTrailConst.MOTION_TURN_DEGREES) {
            lastTurnedMs = performance.now();

            if (fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();
        }

        const tick = Math.floor(nowMs / TrailStampConst.STAMP_INTERVAL_MS);

        if (tick % TrailStampConst.STAMP_COUNT !== index || tick === bornTick) return;
        if (lastTurnedMs === undefined || performance.now() - lastTurnedMs > TrailStampConst.MOTION_GRACE_MS) return;

        bornTick = tick;

        setStamp({ angle, fade, bornMs: nowMs });
    });

    const getAgeRatio = () => {
        const stamp = getStamp();

        return stamp
            ? MathUtils.clamp01((clock.getFrameMs() - stamp.bornMs) / TrailStampConst.TRAIL_LIFETIME_MS)
            : TrackedGradientSampleConst.FULL_AGE_RATIO;
    };

    const getAlpha = () =>
        (getStamp()?.fade ?? 0) *
        (opts?.trailAlpha ?? HandTrail1Const.DEFAULTS.trailAlpha) *
        (1 - getAgeRatio()) ** (opts?.trailDecay ?? HandTrail1Const.DEFAULTS.trailDecay);

    return {
        getAngle: () => getStamp()?.angle ?? HandTrailConst.RESTING_ANGLE,
        getColors: (color: string) => computeSweepColors(color, getAlpha()),
    };
};

export const hand_trail_1 = (opts?: GradientHandTrailOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(
            getRef ?? NO_REF,
            undefined,
            defs.getPointSource,
        );

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        return SVGGradientDefsSolidUtils.computeLinearGradient({
                            id: `gradient1-${id}`,
                            angle: () => getReading().angle + HandTrailConst.QUARTER_TURN,
                            scale: HandTrailConst.SWEEP_SPAN,
                            colors: () =>
                                computeSweepColors(
                                    defs.colors.primary,
                                    TrailStampConst.FULL_ALPHA *
                                        SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
                                ),
                        });
                    },
                },
                clipPath: {
                    id: `clip1-${id}`,
                    renderDefsElement: () => {
                        return (
                            <SVGClipPath id={`clip1-${id}`}>
                                <path
                                    d={SVGUtils.getArcPath(
                                        opts?.sweepArc ?? HandTrail1Const.DEFAULTS.sweepArc,
                                        getSweepRotation(
                                            getReading().angle,
                                            opts?.sweepArc ?? HandTrail1Const.DEFAULTS.sweepArc,
                                        ),
                                    )}
                                />
                            </SVGClipPath>
                        );
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: TrailStampConst.STAMP_COUNT }, (_unused, index) => {
                const stampId = `${index + 2}-${id}`;

                let shared: ReturnType<typeof createHandStamp> | undefined;

                const useStamp = () => (shared ??= createHandStamp(index, getReading, getIsPointerPresent, opts));

                return {
                    gradientOrPattern: {
                        id: `gradient${stampId}`,
                        renderDefsElement: () => {
                            const stamp = useStamp();

                            return SVGGradientDefsSolidUtils.computeLinearGradient({
                                id: `gradient${stampId}`,
                                angle: () => stamp.getAngle() + HandTrailConst.QUARTER_TURN,
                                scale: HandTrailConst.SWEEP_SPAN,
                                colors: () => stamp.getColors(defs.colors.primary),
                            });
                        },
                    },
                    clipPath: {
                        id: `clip${stampId}`,
                        renderDefsElement: () => {
                            const stamp = useStamp();

                            return (
                                <SVGClipPath id={`clip${stampId}`}>
                                    <path
                                        d={SVGUtils.getArcPath(
                                            opts?.sweepArc ?? HandTrail1Const.DEFAULTS.sweepArc,
                                            getSweepRotation(
                                                stamp.getAngle(),
                                                opts?.sweepArc ?? HandTrail1Const.DEFAULTS.sweepArc,
                                            ),
                                        )}
                                    />
                                </SVGClipPath>
                            );
                        },
                    },
                    filter: sharedBlurRef,
                };
            }),
        ];
    },
});
