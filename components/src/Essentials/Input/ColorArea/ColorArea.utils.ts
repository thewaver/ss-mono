import { type Color, MathUtils } from "@thewaver/ss-utils";

import type { ColorAreaAxis } from "./ColorArea.types";

/** The bottom of an axis, in the percent both axes carry. */
const PERCENT_MIN = 0;
/** The top of an axis. */
const PERCENT_MAX = 100;
/** The far edge of the square, as a share of it. */
const RATIO_MAX = 1;

/**
 * The part of a saturation and brightness square that is not about drawing it: which value each axis carries, the
 * color a key press or a drag makes, and what each axis is read out as.
 *
 * Saturation runs across the square and brightness up it, both as `0`–`100` percentages, the units `Color.HSVA`
 * holds them in. Each axis is a native range input of its own, so the keyboard needs nothing new.
 */
export namespace ColorAreaUtils {
    /** The two axes, in the order their inputs are drawn and tabbed through: saturation first. */
    export const AXES: ColorAreaAxis[] = ["saturation", "brightness"];

    /** The bottom of either axis's input. */
    export const AXIS_MIN = PERCENT_MIN;

    /** The top of either axis's input. */
    export const AXIS_MAX = PERCENT_MAX;

    /**
     * What one axis currently holds.
     *
     * @param hsv The color.
     * @param axis The axis.
     * @returns Its percentage, `0` to `100`.
     */
    export const getAxisPercent = (hsv: Color.HSVA, axis: ColorAreaAxis) => (axis === "saturation" ? hsv.s : hsv.v);

    /**
     * What an axis is read out as.
     *
     * @param hsv The color.
     * @param axis The axis.
     * @returns The percentage rounded to a whole number and followed by `%`, for its `aria-valuetext`.
     */
    export const computeValueText = (hsv: Color.HSVA, axis: ColorAreaAxis) =>
        `${Math.round(getAxisPercent(hsv, axis))}%`;

    /**
     * The color with one axis moved, which is what a key press on that axis's input makes.
     *
     * @param hsv The color as it stands.
     * @param axis The axis moved.
     * @param percent Where it moved to. Held inside `0` to `100`.
     * @returns A new color with the other channels untouched.
     */
    export const computeAxisHsv = (hsv: Color.HSVA, axis: ColorAreaAxis, percent: number): Color.HSVA => {
        const clamped = MathUtils.clamp(percent, PERCENT_MIN, PERCENT_MAX);

        return axis === "saturation" ? { ...hsv, s: clamped } : { ...hsv, v: clamped };
    };

    /**
     * The color under a point of the square, which is what a drag makes.
     *
     * Both axes are written in one go: moving them one at a time would report a color in between that the pointer
     * was never over.
     *
     * @param hsv The color as it stands.
     * @param ratio Where the pointer is across and down the square, each `0` to `1`. Down is less brightness, so the
     * top edge is full brightness.
     * @returns A new color with hue and alpha untouched.
     */
    export const computeDraggedHsv = (hsv: Color.HSVA, ratio: { x: number; y: number }): Color.HSVA => ({
        ...hsv,
        s: MathUtils.clamp(ratio.x * PERCENT_MAX, PERCENT_MIN, PERCENT_MAX),
        v: MathUtils.clamp((RATIO_MAX - ratio.y) * PERCENT_MAX, PERCENT_MIN, PERCENT_MAX),
    });

    /**
     * Puts an axis's input back to the value the color holds.
     *
     * The browser moves a range input before it reports, so a refused write — a disabled square, an owner that
     * clamps — would leave the input somewhere the color is not, and the next key press would move on from there.
     * This is the one writer of the input's value, called after every render and after every input event.
     *
     * @param element The axis's input.
     * @param hsv The color.
     * @param axis The axis.
     */
    export const syncAxis = (element: HTMLInputElement, hsv: Color.HSVA, axis: ColorAreaAxis) => {
        const value = `${getAxisPercent(hsv, axis)}`;

        if (element.value === value) return;

        element.value = value;
    };
}
