import { createEffect, createSignal } from "solid-js";

import { Color, EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { SVGDefsColors, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { SVGDefsFrameUtils } from "../../SVGDefsFrames.utils";

type Ripple = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const SOURCE_SCALE = 0.22;
const SOURCE_STOP = 25;
const SOURCE_ALPHA = 0.5;

const RIPPLE_COUNT = 8;
const RIPPLE_SPACING_RATIO = 0.15;
const RIPPLE_LIFETIME_MS = 700;
const RIPPLE_START_SCALE = SOURCE_SCALE;
const RIPPLE_END_SCALE = 0.85;
const RIPPLE_ALPHA = 0.5;
const RIPPLE_DECAY_EXPONENT = 1.8;
const CREST_STOP = 80;
const CREST_SPREAD_START = 20;
const CREST_SPREAD_END = 4;
const CREST_OUTER_LIMIT = 99;
const MOTION_STEP_RATIO = 0.002;
const CYCLE_MS = 1000;
const CYCLE_COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary", "tertiary"];

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const NO_FADE = 0;
const NO_TRAVEL = 0;
const FIRST_MILESTONE = 0;

const NO_REF = () => undefined;

const getCycleColor = (colors: SVGDefsColors, atMs: number) => {
    const phase = ((atMs % CYCLE_MS) / CYCLE_MS) * CYCLE_COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[CYCLE_COLOR_KEYS[index % CYCLE_COLOR_KEYS.length]];
    const to = colors[CYCLE_COLOR_KEYS[(index + 1) % CYCLE_COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const clock = SVGDefsFrameUtils.createClock(RIPPLE_LIFETIME_MS);

const createRipple = (index: number, getRef: () => HTMLElement | undefined) => {
    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef);
    const [getRipple, setRipple] = createSignal<Ripple>();

    let bornMilestone = FIRST_MILESTONE;
    let lastOrigin: Point2d | undefined;
    let travel = NO_TRAVEL;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, getIsPointerPresent());
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

        lastOrigin = origin;

        if (fade > NO_FADE) clock.keepAwake();

        if (step === undefined || step <= MOTION_STEP_RATIO) return;

        travel += step;

        const milestone = Math.floor(travel / RIPPLE_SPACING_RATIO);

        if (milestone % RIPPLE_COUNT !== index || milestone === bornMilestone) return;

        bornMilestone = milestone;

        setRipple({ origin, fade, bornMs: nowMs });
    });

    const getAgeRatio = () => {
        const ripple = getRipple();

        return ripple ? MathUtils.clamp01((clock.getFrameMs() - ripple.bornMs) / RIPPLE_LIFETIME_MS) : FULL_AGE_RATIO;
    };

    const getSpread = () =>
        MathUtils.lerp(CREST_SPREAD_START, CREST_SPREAD_END, EasingUtils.easeOutCubic(getAgeRatio()));

    const getAlpha = () => (getRipple()?.fade ?? 0) * RIPPLE_ALPHA * (1 - getAgeRatio()) ** RIPPLE_DECAY_EXPONENT;

    return {
        getOrigin: () => getRipple()?.origin ?? RESTING_ORIGIN,
        getScale: () => MathUtils.lerp(RIPPLE_START_SCALE, RIPPLE_END_SCALE, EasingUtils.easeOutCubic(getAgeRatio())),
        getColors: (colors: SVGDefsColors) => {
            const color = getCycleColor(colors, getRipple()?.bornMs ?? 0);
            const alpha = getAlpha();
            const spread = getSpread();

            return [
                { value: `rgb(from ${color} r g b / 0)` },
                { value: `rgb(from ${color} r g b / 0)`, stop: CREST_STOP - spread },
                { value: `rgb(from ${color} r g b / ${alpha})`, stop: CREST_STOP },
                { value: `rgb(from ${color} r g b / 0)`, stop: Math.min(CREST_STOP + spread, CREST_OUTER_LIMIT) },
                { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
            ];
        },
    };
};

export const spot_ripple_3c: TrackedGradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        origin: () => getReading().boxRatio,
                        scale: SOURCE_SCALE,
                        colors: () => {
                            const color = getCycleColor(defs.colors, clock.getFrameMs());

                            return [
                                { value: `rgb(from ${color} r g b / 1)` },
                                { value: `rgb(from ${color} r g b / ${SOURCE_ALPHA})`, stop: SOURCE_STOP },
                                { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                            ];
                        },
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
        ...Array.from({ length: RIPPLE_COUNT }, (_unused, index) => ({
            gradientOrPattern: {
                id: `gradient${index + 2}-${id}`,
                renderDefsElement: () => {
                    const ripple = createRipple(index, getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient${index + 2}-${id}`,
                        origin: ripple.getOrigin,
                        scale: ripple.getScale,
                        colors: () => ripple.getColors(defs.colors),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
            blend: true,
        })),
    ],
};
