import { createEffect, createSignal } from "solid-js";

import { Color, MathUtils, SVGUtils, type Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { SVGDefsColors, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { SVGDefsFrameUtils } from "../../SVGDefsFrames.utils";

type HandStamp = {
    angle: number;
    fade: number;
    bornMs: number;
};

const SWEEP_ARC = 90;
const SWEEP_LEAD = 90;
const SWEEP_SPAN: Size2d = { width: 0.7, height: 0.7 };
const HALF_TURN = 180;
const FULL_TURN = 360;

const STAMP_COUNT = Math.ceil(1000 / 60) * 2;
const STAMP_INTERVAL_MS = Math.ceil(1000 / 60);
const TRAIL_LIFETIME_MS = STAMP_COUNT * STAMP_INTERVAL_MS;
const STAMP_ALPHA = 0.25;
const STAMP_DECAY_EXPONENT = 2.2;
const MOTION_TURN_DEGREES = 0.25;
const CYCLE_MS = 1000;
const CYCLE_COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];
const MOTION_GRACE_MS = STAMP_INTERVAL_MS * 2;

const RESTING_ANGLE = 0;
const FULL_AGE_RATIO = 1;
const FULL_ALPHA = 1;
const NO_FADE = 0;

const NO_REF = () => undefined;

const getShortestTurn = (from: number, to: number) => {
    const gap = (((to - from) % FULL_TURN) + FULL_TURN) % FULL_TURN;

    return gap > HALF_TURN ? gap - FULL_TURN : gap;
};

const getSweepRotation = (angle: number) => angle - HALF_TURN - SWEEP_ARC * 0.5;

const getCycleColor = (colors: SVGDefsColors, atMs: number) => {
    const phase = ((atMs % CYCLE_MS) / CYCLE_MS) * CYCLE_COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[CYCLE_COLOR_KEYS[index % CYCLE_COLOR_KEYS.length]];
    const to = colors[CYCLE_COLOR_KEYS[(index + 1) % CYCLE_COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const clock = SVGDefsFrameUtils.createClock(TRAIL_LIFETIME_MS);

const createHandStamp = (index: number, getRef: () => HTMLElement | undefined) => {
    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef);
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

        if (fade > NO_FADE) clock.keepAwake();

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

    const getAlpha = () => (getStamp()?.fade ?? 0) * STAMP_ALPHA * (1 - getAgeRatio()) ** STAMP_DECAY_EXPONENT;

    return {
        getAngle: () => getStamp()?.angle ?? RESTING_ANGLE,
        getColors: (colors: SVGDefsColors) =>
            computeSweepColors(getCycleColor(colors, getStamp()?.bornMs ?? 0), getAlpha()),
    };
};

export const hand_trail_2c: TrackedGradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        angle: () => getReading().angle + SWEEP_LEAD,
                        scale: SWEEP_SPAN,
                        colors: () =>
                            computeSweepColors(
                                getCycleColor(defs.colors, clock.getFrameMs()),
                                FULL_ALPHA * SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
                            ),
                    });
                },
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return (
                        <clipPath id={`clip1-${id}`} clipPathUnits="objectBoundingBox">
                            <path d={SVGUtils.getArcPath(SWEEP_ARC, getSweepRotation(getReading().angle))} />
                        </clipPath>
                    );
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
        ...Array.from({ length: STAMP_COUNT }, (_unused, index) => {
            const stampId = `${index + 2}-${id}`;

            let shared: ReturnType<typeof createHandStamp> | undefined;

            const useStamp = () => (shared ??= createHandStamp(index, getRef ?? NO_REF));

            return {
                gradientOrPattern: {
                    id: `gradient${stampId}`,
                    renderDefsElement: () => {
                        const stamp = useStamp();

                        return SVGGradientDefsUtils.computeLinearGradient({
                            id: `gradient${stampId}`,
                            angle: () => stamp.getAngle() + SWEEP_LEAD,
                            scale: SWEEP_SPAN,
                            colors: () => stamp.getColors(defs.colors),
                        });
                    },
                },
                clipPath: {
                    id: `clip${stampId}`,
                    renderDefsElement: () => {
                        const stamp = useStamp();

                        return (
                            <clipPath id={`clip${stampId}`} clipPathUnits="objectBoundingBox">
                                <path d={SVGUtils.getArcPath(SWEEP_ARC, getSweepRotation(stamp.getAngle()))} />
                            </clipPath>
                        );
                    },
                },
                filter: SVGDefsUtils.getBaseBlur(id, defs),
            };
        }),
    ],
};
