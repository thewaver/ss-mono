import { createEffect, createSignal } from "solid-js";

import {
    type GradientHandTrailOpts,
    type PointerReading,
    type SVGDefsColors,
    SVGDefsUtils,
} from "@thewaver/ss-components";
import {
    HandTrail3Const,
    HandTrailConst,
    TrackedGradientSampleConst,
    TrailStampConst,
} from "@thewaver/ss-components/internal";
import { Color, MathUtils, SVGUtils } from "@thewaver/ss-utils";

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

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientHandTrailOpts) => {
    const cycleMs = opts?.cycleMs ?? HandTrail3Const.DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * HandTrail3Const.COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[HandTrail3Const.COLOR_KEYS[index % HandTrail3Const.COLOR_KEYS.length]];
    const to = colors[HandTrail3Const.COLOR_KEYS[(index + 1) % HandTrail3Const.COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

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
    isCycling: boolean,
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

        if (
            fade > TrackedGradientSampleConst.NO_FADE &&
            (isCycling || (turn !== undefined && turn > HandTrailConst.MOTION_TURN_DEGREES))
        )
            clock.keepAwake();

        if (turn !== undefined && turn > HandTrailConst.MOTION_TURN_DEGREES) lastTurnedMs = performance.now();

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
        (opts?.trailAlpha ?? HandTrail3Const.DEFAULTS.trailAlpha) *
        (1 - getAgeRatio()) ** (opts?.trailDecay ?? HandTrail3Const.DEFAULTS.trailDecay);

    const getColorKey = () => {
        const band = Math.floor(
            (getAgeRatio() / (opts?.ageColorSpan ?? HandTrail3Const.DEFAULTS.ageColorSpan)) *
                HandTrail3Const.COLOR_KEYS.length,
        );

        return HandTrail3Const.COLOR_KEYS[Math.min(band, HandTrail3Const.COLOR_KEYS.length - 1)];
    };

    return {
        getAngle: () => getStamp()?.angle ?? HandTrailConst.RESTING_ANGLE,
        getColors: (colors: SVGDefsColors) =>
            isCycling
                ? computeSweepColors(getCycleColor(colors, getStamp()?.bornMs ?? 0, opts), getAlpha())
                : computeSweepColors(colors[getColorKey()], getAlpha()),
    };
};

export const hand_trail_3 = (opts?: GradientHandTrailOpts): TrackedGradientConfig => ({
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
                                    getCycleColor(defs.colors, clock.getFrameMs(), opts),
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
                                        opts?.sweepArc ?? HandTrail3Const.DEFAULTS.sweepArc,
                                        getSweepRotation(
                                            getReading().angle,
                                            opts?.sweepArc ?? HandTrail3Const.DEFAULTS.sweepArc,
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

                const useStamp = () =>
                    (shared ??= createHandStamp(index, getReading, getIsPointerPresent, Boolean(opts?.cycles), opts));

                return {
                    gradientOrPattern: {
                        id: `gradient${stampId}`,
                        renderDefsElement: () => {
                            const stamp = useStamp();

                            return SVGGradientDefsSolidUtils.computeLinearGradient({
                                id: `gradient${stampId}`,
                                angle: () => stamp.getAngle() + HandTrailConst.QUARTER_TURN,
                                scale: HandTrailConst.SWEEP_SPAN,
                                colors: opts?.cycles
                                    ? () => stamp.getColors(defs.colors)
                                    : () => stamp.getColors(defs.colors),
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
                                            opts?.sweepArc ?? HandTrail3Const.DEFAULTS.sweepArc,
                                            getSweepRotation(
                                                stamp.getAngle(),
                                                opts?.sweepArc ?? HandTrail3Const.DEFAULTS.sweepArc,
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
