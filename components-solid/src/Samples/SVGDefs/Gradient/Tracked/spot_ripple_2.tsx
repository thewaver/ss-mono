import { createEffect, createSignal } from "solid-js";

import {
    type GradientRippleSampleOpts,
    type PointerReading,
    type SVGDefsColors,
    SVGDefsUtils,
} from "@thewaver/ss-components";
import {
    SpotConst,
    SpotRipple2Const,
    SpotRippleConst,
    TrackedGradientSampleConst,
} from "@thewaver/ss-components/internal";
import { Color, EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

type Ripple = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const NO_REF = () => undefined;

const getCycleColor = (colors: SVGDefsColors, atMs: number, opts?: GradientRippleSampleOpts) => {
    const cycleMs = opts?.cycleMs ?? SpotRipple2Const.DEFAULTS.cycleMs;
    const phase = ((atMs % cycleMs) / cycleMs) * SpotRipple2Const.COLOR_KEYS.length;
    const index = Math.floor(phase);
    const from = colors[SpotRipple2Const.COLOR_KEYS[index % SpotRipple2Const.COLOR_KEYS.length]];
    const to = colors[SpotRipple2Const.COLOR_KEYS[(index + 1) % SpotRipple2Const.COLOR_KEYS.length]];

    if (!Color.Hex.isHex(from) || !Color.Hex.isHex(to)) return from;

    return Color.Hex.interpolate(from, to, phase - index);
};

const clock = SVGDefsSolidUtils.createClock(SpotRippleConst.RIPPLE_LIFETIME_MS);

const createRipple = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
    isCycling: boolean,
    opts?: GradientRippleSampleOpts,
) => {
    const [getRipple, setRipple] = createSignal<Ripple>();

    let bornMilestone = SpotRippleConst.FIRST_MILESTONE;
    let lastOrigin: Point2d | undefined;
    let travel = SpotRippleConst.NO_TRAVEL;

    clock.subscribe();

    createEffect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const origin = reading.boxRatio;
        const fade = SVGDefsUtils.getPointerFade(reading, getIsPointerPresent());
        const step = lastOrigin && Point2dUtils.getLength({ x: origin.x - lastOrigin.x, y: origin.y - lastOrigin.y });

        lastOrigin = origin;

        if (isCycling && fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();

        if (step === undefined || step <= SpotConst.MOTION_STEP_RATIO) return;

        travel += step;

        if (fade > TrackedGradientSampleConst.NO_FADE) clock.keepAwake();

        const milestone = Math.floor(
            travel / (opts?.rippleSpacingRatio ?? SpotRipple2Const.DEFAULTS.rippleSpacingRatio),
        );

        if (
            milestone % (opts?.rippleCount ?? SpotRipple2Const.DEFAULTS.rippleCount) !== index ||
            milestone === bornMilestone
        )
            return;

        bornMilestone = milestone;

        setRipple({ origin, fade, bornMs: nowMs });
    });

    const getAgeRatio = () => {
        const ripple = getRipple();

        return ripple
            ? MathUtils.clamp01((clock.getFrameMs() - ripple.bornMs) / SpotRippleConst.RIPPLE_LIFETIME_MS)
            : TrackedGradientSampleConst.FULL_AGE_RATIO;
    };

    const getSpread = () =>
        MathUtils.lerp(
            opts?.crestSpreadStart ?? SpotRipple2Const.DEFAULTS.crestSpreadStart,
            opts?.crestSpreadEnd ?? SpotRipple2Const.DEFAULTS.crestSpreadEnd,
            EasingUtils.easeOutCubic(getAgeRatio()),
        );

    const getAlpha = () =>
        (getRipple()?.fade ?? 0) *
        (opts?.rippleAlpha ?? SpotRipple2Const.DEFAULTS.rippleAlpha) *
        (1 - getAgeRatio()) ** (opts?.rippleDecay ?? SpotRipple2Const.DEFAULTS.rippleDecay);

    return {
        getOrigin: () => getRipple()?.origin ?? SpotConst.RESTING_ORIGIN,
        getScale: () =>
            MathUtils.lerp(
                opts?.rippleStartScale ?? SpotRipple2Const.DEFAULTS.rippleStartScale,
                opts?.rippleEndScale ?? SpotRipple2Const.DEFAULTS.rippleEndScale,
                EasingUtils.easeOutCubic(getAgeRatio()),
            ),
        getColors: (colors: SVGDefsColors, index: number) => {
            const color = isCycling
                ? getCycleColor(colors, getRipple()?.bornMs ?? 0, opts)
                : colors[SpotRipple2Const.COLOR_KEYS[index % SpotRipple2Const.COLOR_KEYS.length]];
            const alpha = getAlpha();
            const spread = getSpread();

            return [
                { value: `rgb(from ${color} r g b / 0)` },
                {
                    value: `rgb(from ${color} r g b / 0)`,
                    stop: (opts?.crestStop ?? SpotRipple2Const.DEFAULTS.crestStop) - spread,
                },
                {
                    value: `rgb(from ${color} r g b / ${alpha})`,
                    stop: opts?.crestStop ?? SpotRipple2Const.DEFAULTS.crestStop,
                },
                {
                    value: `rgb(from ${color} r g b / 0)`,
                    stop: Math.min(
                        (opts?.crestStop ?? SpotRipple2Const.DEFAULTS.crestStop) + spread,
                        SpotRippleConst.CREST_OUTER_LIMIT,
                    ),
                },
                { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
            ];
        },
    };
};

export const spot_ripple_2 = (opts?: GradientRippleSampleOpts): TrackedGradientConfig => ({
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
                        return SVGGradientDefsSolidUtils.computeRadialGradient({
                            id: `gradient1-${id}`,
                            elementSize:
                                (opts?.circular ?? SpotRipple2Const.DEFAULTS.circular)
                                    ? () => defs.getSize()
                                    : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.sourceScale ?? SpotRipple2Const.DEFAULTS.sourceScale,
                            colors: () => {
                                const color = opts?.cycles
                                    ? getCycleColor(defs.colors, clock.getFrameMs(), opts)
                                    : defs.colors.primary;

                                return [
                                    { value: `rgb(from ${color} r g b / 1)` },
                                    {
                                        value: `rgb(from ${color} r g b / ${opts?.sourceAlpha ?? SpotRipple2Const.DEFAULTS.sourceAlpha})`,
                                        stop: opts?.sourceStop ?? SpotRipple2Const.DEFAULTS.sourceStop,
                                    },
                                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                                ];
                            },
                        });
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: opts?.rippleCount ?? SpotRipple2Const.DEFAULTS.rippleCount }, (_unused, index) => ({
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

                        return SVGGradientDefsSolidUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize:
                                (opts?.circular ?? SpotRipple2Const.DEFAULTS.circular)
                                    ? () => defs.getSize()
                                    : undefined,
                            origin: ripple.getOrigin,
                            scale: ripple.getScale,
                            colors: () => ripple.getColors(defs.colors, index),
                        });
                    },
                },
                filter: sharedBlurRef,
                blend: true,
            })),
        ];
    },
});
