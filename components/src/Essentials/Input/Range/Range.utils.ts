import { AngleUtils, MathUtils, Point2d, Point2dUtils } from "@thewaver/ss-utils";

/** A full turn, in degrees. */
const FULL_TURN = 360;
/** Half of anything. */
const HALF = 0.5;

/** How many digits a step carries after the point, so a stepped value can be rounded back to them. */
const countStepDecimals = (step: number) => {
    const [, decimals = ""] = `${step}`.split(".");

    return decimals.length;
};

/**
 * Arithmetic for a range's value where it is not read off a straight track.
 *
 * What a pointer-driven range needs beside its own component: rounding a raw reading to the step the keyboard
 * uses, and turning a point into a value by its angle, which is what a knob is.
 */
export namespace RangeUtils {
    /**
     * Rounds a raw value to the nearest step and keeps it inside its bounds.
     *
     * Steps are counted from `min`, as the arrow keys count them, and the answer is rounded back to the step's own
     * decimals, so a step of `0.1` gives `0.3` rather than `0.30000000000000004`.
     *
     * @param value The raw reading.
     * @param defs.min The smallest value allowed, and where steps are counted from.
     * @param defs.max The largest value allowed.
     * @param defs.step How far one step is. Zero or less leaves the value unrounded.
     * @returns The stepped value, clamped into `min` to `max`.
     */
    export const computeSteppedValue = (value: number, defs: { min: number; max: number; step: number }) => {
        const stepped =
            defs.step > 0
                ? MathUtils.roundToDecimalPlaces(
                      defs.min + Math.round((value - defs.min) / defs.step) * defs.step,
                      countStepDecimals(defs.step),
                  )
                : value;

        return MathUtils.clamp(stepped, defs.min, defs.max);
    };

    /**
     * Reads a point as a value by the angle it makes around the center of a box, which is what a knob does.
     *
     * Angles are in degrees, `0` pointing right and increasing clockwise, as elsewhere in the library. The range
     * starts at `startAngle` and runs `sweepAngle` degrees round from it — clockwise when positive, the other
     * way when negative — so a knob whose travel begins at the bottom left and ends at the bottom right is a start
     * of `135` and a sweep of `270`. A point in the gap a partial sweep leaves reads as whichever end it is nearer.
     * A full sweep of `360` meets itself at the start, so the value jumps from `max` to `min` as the pointer
     * crosses it.
     *
     * The answer is not stepped; {@link RangeUtils.computeSteppedValue} does that, and a `Range` does it itself.
     *
     * @param point The pointer, in the same coordinates as `rect`.
     * @param rect The box the knob is drawn in. Its center is the pivot.
     * @param defs.min The value at `startAngle`.
     * @param defs.max The value at the far end of the sweep.
     * @param defs.startAngle Where the travel begins.
     * @param defs.sweepAngle How far the travel runs. Clamped to one turn either way; zero reads everything as
     * `min`.
     * @returns A value from `min` to `max`. The center itself has no angle and reads as `min`.
     */
    export const computeAngularValue = (
        point: Point2d,
        rect: { left: number; top: number; width: number; height: number },
        defs: { min: number; max: number; startAngle: number; sweepAngle: number },
    ) => {
        const sweep = MathUtils.clamp(Math.abs(defs.sweepAngle), 0, FULL_TURN);

        if (sweep === 0) return defs.min;

        const center = { x: rect.left + rect.width * HALF, y: rect.top + rect.height * HALF };
        const offset = Point2d.sub(point, center);

        if (offset.x === 0 && offset.y === 0) return defs.min;

        const turned = AngleUtils.wrapPositive(
            (Point2dUtils.getAngle(offset) - defs.startAngle) * (defs.sweepAngle < 0 ? -1 : 1),
        );
        const ratio = turned <= sweep ? turned / sweep : turned - sweep < (FULL_TURN - sweep) * HALF ? 1 : 0;

        return MathUtils.lerp(defs.min, defs.max, ratio);
    };
}
