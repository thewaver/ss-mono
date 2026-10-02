import { createEffect, createSignal } from "solid-js";

import {
    type GradientHandTrailOpts,
    type PointerReading,
    type SVGDefsColors,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import { Color, MathUtils, SVGUtils, type Size2d } from "@thewaver/ss-utils";

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

const SWEEP_SPAN: Size2d = { width: 0.7, height: 0.7 };
const QUARTER_TURN = 90;
const HALF_TURN = 180;
const FULL_TURN = 360;

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const MOTION_TURN_DEGREES = 0.25;
const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ANGLE = 0;
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;

const DEFAULTS = TrackedGradientDefaults.HAND_TRAIL_CYCLING_DEFAULTS;

const NO_REF = () => undefined;

const getShortestTurn = (from: number, to: number) => {
    const gap = (((to - from) % FULL_TURN) + FULL_TURN) % FULL_TURN;

    return gap > HALF_TURN ? gap - FULL_TURN : gap;
};

const getSweepRotation = (angle: number, arc: number) => angle - HALF_TURN - arc * 0.5;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientHandTrailOpts) => {
    const cycleMs = opts?.cycleMs ?? DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[COLOR_KEYS[index % COLOR_KEYS.length]];
    const to = colors[COLOR_KEYS[(index + 1) % COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const clock = SVGDefsSolidUtils.createClock(TRAIL_LIFETIME_MS);

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

        if (fade > NO_FADE && (isCycling || (turn !== undefined && turn > MOTION_TURN_DEGREES))) clock.keepAwake();

        if (turn !== undefined && turn > MOTION_TURN_DEGREES) lastTurnedMs = performance.now();

        const tick = Math.floor(nowMs / STAMP_INTERVAL_MS);

        if (tick % STAMP_COUNT !== index || tick === bornTick) return;
        if (lastTurnedMs === undefined || performance.now() - lastTurnedMs > MOTION_GRACE_MS) return;

        bornTick = tick;

        setStamp({ angle, fade, bornMs: nowMs });
    });

    const getAgeRatio = () => {
        const stamp = getStamp();

        return stamp ? MathUtils.clamp01((clock.getFrameMs() - stamp.bornMs) / TRAIL_LIFETIME_MS) : FULL_AGE_RATIO;
    };

    const getAlpha = () =>
        (getStamp()?.fade ?? 0) *
        (opts?.trailAlpha ?? DEFAULTS.trailAlpha) *
        (1 - getAgeRatio()) ** (opts?.trailDecay ?? DEFAULTS.trailDecay);

    const getColorKey = () => {
        const band = Math.floor((getAgeRatio() / (opts?.ageColorSpan ?? DEFAULTS.ageColorSpan)) * COLOR_KEYS.length);

        return COLOR_KEYS[Math.min(band, COLOR_KEYS.length - 1)];
    };

    return {
        getAngle: () => getStamp()?.angle ?? RESTING_ANGLE,
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

        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRef ?? NO_REF);

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
                            angle: () => getReading().angle + QUARTER_TURN,
                            scale: SWEEP_SPAN,
                            colors: () =>
                                computeSweepColors(
                                    getCycleColor(defs.colors, clock.getFrameMs(), opts),
                                    FULL_ALPHA * SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
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
                                        opts?.sweepArc ?? DEFAULTS.sweepArc,
                                        getSweepRotation(getReading().angle, opts?.sweepArc ?? DEFAULTS.sweepArc),
                                    )}
                                />
                            </SVGClipPath>
                        );
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: STAMP_COUNT }, (_unused, index) => {
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
                                angle: () => stamp.getAngle() + QUARTER_TURN,
                                scale: SWEEP_SPAN,
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
                                            opts?.sweepArc ?? DEFAULTS.sweepArc,
                                            getSweepRotation(stamp.getAngle(), opts?.sweepArc ?? DEFAULTS.sweepArc),
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
