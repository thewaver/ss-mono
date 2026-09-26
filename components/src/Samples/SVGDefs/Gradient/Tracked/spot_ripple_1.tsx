import { createEffect, createSignal } from "solid-js";

import { EasingUtils, MathUtils, type Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../../../Abstracts/PointerTracker/PointerTracker.types";
import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefs.utils";
import type { GradientRippleSampleOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientDefaults } from "../TrackedGradient.const";

type Ripple = {
    origin: Point2d;
    fade: number;
    bornMs: number;
};

const RIPPLE_LIFETIME_MS = 700;
const CREST_OUTER_LIMIT = 99;
const MOTION_STEP_RATIO = 0.002;

const RESTING_ORIGIN: Point2d = { x: 0.5, y: 0.5 };
const FULL_AGE_RATIO = 1;
const NO_FADE = 0;
const NO_TRAVEL = 0;
const FIRST_MILESTONE = 0;

const DEFAULTS = TrackedGradientDefaults.SPOT_RIPPLE_DEFAULTS;

const NO_REF = () => undefined;

const clock = SVGDefsUtils.createClock(RIPPLE_LIFETIME_MS);

const createRipple = (
    index: number,
    getReading: () => PointerReading,
    getIsPointerPresent: () => boolean,
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
        getColors: (color: string) => {
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

export const spot_ripple_1 = (opts?: GradientRippleSampleOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

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
                            elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
                            origin: () => getReading().boxRatio,
                            scale: opts?.sourceScale ?? DEFAULTS.sourceScale,
                            colors: [
                                { value: `rgb(from ${defs.colors.primary} r g b / 1)` },
                                {
                                    value: `rgb(from ${defs.colors.primary} r g b / ${opts?.sourceAlpha ?? DEFAULTS.sourceAlpha})`,
                                    stop: opts?.sourceStop ?? DEFAULTS.sourceStop,
                                },
                                { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                            ],
                        });
                    },
                },
                filter: sharedBlur,
            },
            ...Array.from({ length: opts?.rippleCount ?? DEFAULTS.rippleCount }, (_unused, index) => ({
                gradientOrPattern: {
                    id: `gradient${index + 2}-${id}`,
                    renderDefsElement: () => {
                        const ripple = createRipple(index, getReading, getIsPointerPresent, opts);

                        return SVGGradientDefsUtils.computeRadialGradient({
                            id: `gradient${index + 2}-${id}`,
                            elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
                            origin: ripple.getOrigin,
                            scale: ripple.getScale,
                            colors: () => ripple.getColors(defs.colors.primary),
                        });
                    },
                },
                filter: sharedBlurRef,
                blend: true,
            })),
        ];
    },
});
