import { createEffect, createSignal } from "solid-js";

import { Color, EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../../../Abstracts/PointerTracker/PointerTracker.types";
import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientRippleSampleOpts, SVGDefsColors, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { SVGDefsFrameUtils } from "../../SVGDefsFrames.utils";
import { TrackedGradientKnobs } from "../TrackedGradient.knobs";

type Ripple = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const RIPPLE_LIFETIME_MS = 700;
const CREST_OUTER_LIMIT = 99;
const MOTION_STEP_RATIO = 0.002;
const COLOR_KEYS: (keyof SVGDefsColors)[] = ["primary", "secondary"];

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const NO_FADE = 0;
const NO_TRAVEL = 0;
const FIRST_MILESTONE = 0;

const DEFAULTS = TrackedGradientKnobs.SPOT_RIPPLE_CYCLING_DEFAULTS;

const NO_REF = () => undefined;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientRippleSampleOpts) => {
    const cycleMs = opts?.cycleMs ?? DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[COLOR_KEYS[index % COLOR_KEYS.length]];
    const to = colors[COLOR_KEYS[(index + 1) % COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const clock = SVGDefsFrameUtils.createClock(RIPPLE_LIFETIME_MS);

const createRipple = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    isCycling: boolean,
    opts?: GradientRippleSampleOpts,
) => {
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

        if (isCycling && fade > NO_FADE) clock.keepAwake();

        if (step === undefined || step <= MOTION_STEP_RATIO) return;

        travel += step;

        if (fade > NO_FADE) clock.keepAwake();

        const milestone = Math.floor(travel / (opts?.rippleSpacingRatio ?? DEFAULTS.rippleSpacingRatio));

        if (milestone % (opts?.rippleCount ?? DEFAULTS.rippleCount) !== index || milestone === bornMilestone) return;

        bornMilestone = milestone;

        setRipple({ origin, fade, bornMs: nowMs });
    });

    const getAgeRatio = () => {
        const ripple = getRipple();

        return ripple ? MathUtils.clamp01((clock.getFrameMs() - ripple.bornMs) / RIPPLE_LIFETIME_MS) : FULL_AGE_RATIO;
    };

    const getSpread = () =>
        MathUtils.lerp(
            opts?.crestSpreadStart ?? DEFAULTS.crestSpreadStart,
            opts?.crestSpreadEnd ?? DEFAULTS.crestSpreadEnd,
            EasingUtils.easeOutCubic(getAgeRatio()),
        );

    const getAlpha = () =>
        (getRipple()?.fade ?? 0) *
        (opts?.rippleAlpha ?? DEFAULTS.rippleAlpha) *
        (1 - getAgeRatio()) ** (opts?.rippleDecay ?? DEFAULTS.rippleDecay);

    return {
        getOrigin: () => getRipple()?.origin ?? RESTING_ORIGIN,
        getScale: () =>
            MathUtils.lerp(
                opts?.rippleStartScale ?? DEFAULTS.rippleStartScale,
                opts?.rippleEndScale ?? DEFAULTS.rippleEndScale,
                EasingUtils.easeOutCubic(getAgeRatio()),
            ),
        getColors: (colors: SVGDefsColors, index: number) => {
            const color = isCycling
                ? getCycleColor(colors, getRipple()?.bornMs ?? 0, opts)
                : colors[COLOR_KEYS[index % COLOR_KEYS.length]];
            const alpha = getAlpha();
            const spread = getSpread();

            return [
                { value: `rgb(from ${color} r g b / 0)` },
                { value: `rgb(from ${color} r g b / 0)`, stop: (opts?.crestStop ?? DEFAULTS.crestStop) - spread },
                { value: `rgb(from ${color} r g b / ${alpha})`, stop: opts?.crestStop ?? DEFAULTS.crestStop },
                {
                    value: `rgb(from ${color} r g b / 0)`,
                    stop: Math.min((opts?.crestStop ?? DEFAULTS.crestStop) + spread, CREST_OUTER_LIMIT),
                },
                { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
            ];
        },
    };
};

export const spot_ripple_2 = (opts?: GradientRippleSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef ?? NO_REF);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient1-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.sourceScale ?? DEFAULTS.sourceScale,
                            colors: () => {
                                const color = opts?.cycles
                                    ? getCycleColor(defs.colors, clock.getFrameMs(), opts)
                                    : defs.colors.primary;

                                return [
                                    { value: `rgb(from ${color} r g b / 1)` },
                                    {
                                        value: `rgb(from ${color} r g b / ${opts?.sourceAlpha ?? DEFAULTS.sourceAlpha})`,
                                        stop: opts?.sourceStop ?? DEFAULTS.sourceStop,
                                    },
                                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                                ];
                            },
                        });
                    },
                },
                filter: SVGDefsUtils.getBaseBlur(id, defs),
            },
            ...Array.from({ length: opts?.rippleCount ?? DEFAULTS.rippleCount }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const ripple = createRipple(
                            index,
                            getReading,
                            getIsPointerPresent,
                            Boolean(opts?.cycles),
                            opts,
                        );

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: opts?.circular ? () => defs.getSize() : undefined,
                            origin: ripple.getOrigin,
                            scale: ripple.getScale,
                            colors: () => ripple.getColors(defs.colors, index),
                        });
                    },
                },
                filter: SVGDefsUtils.getBaseBlur(id, defs),
                blend: true,
            })),
        ];
    },
});
