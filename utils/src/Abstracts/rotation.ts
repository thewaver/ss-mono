import { MathUtils } from "./math.js";

const MAX_JITTER_RATIO = 0.5;
const MIN_SPIN_TURNS = 1;

export namespace RotationUtils {
    /**
     * Finds the angle one step occupies when a full turn is divided evenly.
     *
     * The unit every other function here is measured in: a wheel of `8` gives `45`, a wheel of `3` gives
     * `120`. Degrees rather than radians throughout this namespace, because the numbers end up in CSS
     * transforms and a reader checking one against the other should not have to convert in their head.
     *
     * A count of zero or less reports `0` rather than dividing by zero, so a wheel that has not been given
     * anything to show holds still instead of producing `Infinity`.
     *
     * @param stepCount How many steps the turn is divided into.
     */
    export const getStepAngle = (stepCount: number) => (stepCount > 0 ? 360 / stepCount : 0);

    /**
     * Finds the angle the wheel has to sit at for a given step to be the one on show.
     *
     * Zero is the resting position and belongs to step `0`, so this answers `0` for the first step. It
     * counts **backwards** from there: step `1` of `8` is at `315`, not `45`. That is the direction that
     * makes an increasing index bring later steps round to a fixed marker, which is what a wheel does — the
     * marker stays put and the wheel moves under it.
     *
     * The index is wrapped first, so an index past the end names the step it lands on rather than running
     * off the wheel, and the result is always in `0..359`.
     *
     * @param index Which step should be showing. Wrapped into range.
     * @param stepCount How many steps there are. Zero or less reports `0`.
     */
    export const getIndexAngle = (index: number, stepCount: number) => {
        if (stepCount < 1) return 0;

        return (360 - getStepAngle(stepCount) * MathUtils.wrapIndex(index, stepCount)) % 360;
    };

    /**
     * Finds which step a given angle is showing, the exact inverse of `getIndexAngle`.
     *
     * Rounding is what decides the boundary: a step keeps the answer until the wheel is more than half a
     * step past it, so the reading changes at the middle of the gap between two steps rather than the
     * instant one starts to leave. This is what lets a wheel be read while it is still moving.
     *
     * Any number of whole turns is ignored, so an angle four turns along reads the same as its first-turn
     * equivalent, and a negative angle reads the same as its positive one.
     *
     * @param angle Where the wheel currently sits, in degrees.
     * @param stepCount How many steps there are. Zero or less reports `0`.
     */
    export const getAngleIndex = (angle: number, stepCount: number) => {
        if (stepCount < 1) return 0;

        return MathUtils.wrapIndex(Math.round(-angle / getStepAngle(stepCount)), stepCount);
    };

    /**
     * Finds the angle a spin should end on: some whole turns, then the step it was aiming for.
     *
     * The result is always **greater** than the angle it starts from, whatever that was. A wheel that
     * unwound to reach its target would read as a correction rather than a spin, so the whole turns are
     * counted from above the current angle rather than from zero.
     *
     * At least one whole turn is always added, even when none is asked for. A spin of no turns that happens
     * to target the step already showing would not move at all, and a wheel that does nothing when spun is
     * indistinguishable from a broken one.
     *
     * The angle keeps accumulating rather than resetting each spin, so it grows without bound over a long
     * session. That is deliberate: a transition animating to a smaller number would run backwards. Callers
     * that need the reading rather than the total pass it through `getAngleIndex`, which ignores whole turns.
     *
     * @param fromAngle Where the wheel is now, in degrees.
     * @param index Which step to land on. Wrapped into range.
     * @param stepCount How many steps there are.
     * @param turns How many whole turns to spin through. Truncated, and raised to `1` if lower.
     */
    export const getSpinAngle = (fromAngle: number, index: number, stepCount: number, turns: number) => {
        const wholeTurns = Math.ceil(fromAngle / 360);
        const extraTurns = Math.max(MIN_SPIN_TURNS, Math.trunc(turns));

        return (wholeTurns + extraTurns) * 360 + getIndexAngle(index, stepCount);
    };

    /**
     * Finds how far past its target a spin should overshoot, as an angle.
     *
     * The ratio is of one step, not of the whole turn, so `0.25` on a wheel of `8` is a quarter of `45`.
     * Expressing it that way keeps an overshoot looking the same on wheels of different sizes, where a
     * fixed number of degrees would be a nudge on a small wheel and a whole step on a large one.
     *
     * The ratio is clamped to half a step either way, which is the point at which `getAngleIndex` would
     * start reading the step next door: an overshoot past that would leave the wheel visibly showing one
     * step while reporting another. A caller asking for more gets the largest overshoot that is still
     * honest rather than an error.
     *
     * @param jitterRatio How far to overshoot, as a fraction of one step. Clamped to `-0.5..0.5`.
     * @param stepCount How many steps there are.
     */
    export const getJitterAngle = (jitterRatio: number, stepCount: number) =>
        getStepAngle(stepCount) * MathUtils.clamp(jitterRatio, -MAX_JITTER_RATIO, MAX_JITTER_RATIO);
}
