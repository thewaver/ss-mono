import { type EasingFn, EasingUtils } from "@thewaver/ss-utils";

import type { ParticleTravelEasingType } from "./ParticleTravelEasings.types";

const OVERSHOOT_WINDOW_START_T = 0.85;
const OVERSHOOT_MAX_STRENGTH = 6;
const PERCENT = 100;

export namespace ParticleTravelEasings {
    export const SAMPLE_EASINGS: Record<ParticleTravelEasingType, EasingFn> = {
        linear: EasingUtils.linear,
        ease: EasingUtils.ease,
        ease_in: EasingUtils.easeIn,
        ease_out: EasingUtils.easeOut,
        ease_in_out: EasingUtils.easeInOut,
        ease_in_quad: EasingUtils.easeInQuad,
        ease_out_quad: EasingUtils.easeOutQuad,
        ease_in_out_quad: EasingUtils.easeInOutQuad,
        ease_in_cubic: EasingUtils.easeInCubic,
        ease_out_cubic: EasingUtils.easeOutCubic,
        ease_in_out_cubic: EasingUtils.easeInOutCubic,
        ease_in_quart: EasingUtils.easeInQuart,
        ease_out_quart: EasingUtils.easeOutQuart,
        ease_in_out_quart: EasingUtils.easeInOutQuart,
        ease_in_quint: EasingUtils.easeInQuint,
        ease_out_quint: EasingUtils.easeOutQuint,
        ease_in_out_quint: EasingUtils.easeInOutQuint,
        ease_in_sine: EasingUtils.easeInSine,
        ease_out_sine: EasingUtils.easeOutSine,
        ease_in_out_sine: EasingUtils.easeInOutSine,
        ease_in_expo: EasingUtils.easeInExpo,
        ease_out_expo: EasingUtils.easeOutExpo,
        ease_in_out_expo: EasingUtils.easeInOutExpo,
        ease_in_circ: EasingUtils.easeInCirc,
        ease_out_circ: EasingUtils.easeOutCirc,
        ease_in_out_circ: EasingUtils.easeInOutCirc,
        ease_in_back: EasingUtils.easeInBack,
        ease_out_back: EasingUtils.easeOutBack,
        ease_in_out_back: EasingUtils.easeInOutBack,
        ease_in_elastic: EasingUtils.easeInElastic,
        ease_out_elastic: EasingUtils.easeOutElastic,
        ease_in_out_elastic: EasingUtils.easeInOutElastic,
        ease_out_bounce: EasingUtils.easeOutBounce,
        ease_in_bounce: EasingUtils.easeInBounce,
        ease_in_out_bounce: EasingUtils.easeInOutBounce,
    };

    export const EASING_TYPES = Object.keys(SAMPLE_EASINGS) as ParticleTravelEasingType[];

    /**
     * Lets a particle run past the end of its path and come back to it, by bending its eased progress near the end.
     *
     * The bend starts at 85% of the way along and peaks before the end, so the path is followed as eased until then
     * and arrives exactly at its end. At `0` nothing changes.
     *
     * @param rawT How far along the path, `0`–`1`, before easing.
     * @param valueT The same after easing, which the bend is added to.
     * @param overshootPercent How far past the end to run, `0`–`100`.
     * @returns The progress to hand the path, which may pass `1` on the way back.
     */
    export const applyOvershoot = (rawT: number, valueT: number, overshootPercent: number): number => {
        if (overshootPercent <= 0 || rawT <= OVERSHOOT_WINDOW_START_T) return valueT;

        const windowSpan = 1 - OVERSHOOT_WINDOW_START_T;
        const localT = (rawT - OVERSHOOT_WINDOW_START_T) / windowSpan;
        const strength = (overshootPercent / PERCENT) * OVERSHOOT_MAX_STRENGTH;
        const bump = strength * localT * localT * (1 - localT);

        return valueT + windowSpan * bump;
    };
}
