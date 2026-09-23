const NOTHING = 0;
const HALF = 0.5;
const STRAIGHT = 180;
const FULL_TURN = 360;

/**
 * The arithmetic of bearings, which is not the arithmetic of numbers.
 *
 * A bearing is a position on a circle rather than a quantity: `350` and `10` are twenty degrees apart
 * and neither is larger than the other, and the same direction can be written down infinitely many
 * ways. Every operation here answers in one canonical form so that two bearings compared, subtracted
 * or advanced behave the way the circle does rather than the way the number line does — which is the
 * mistake this namespace exists to stop, subtracting two bearings with `-` being right almost
 * everywhere and wrong at exactly the place a run's two ends meet.
 *
 * Degrees throughout, and `0` points right with the angle increasing clockwise, since screen
 * coordinates run downwards.
 */
export namespace AngleUtils {
    /** How many radians make up one degree. Multiply a value in degrees by this to get radians. */
    export const RADIANS_PER_DEGREE = Math.PI / STRAIGHT;

    /** How many degrees make up one radian. Multiply a value in radians by this to get degrees. */
    export const DEGREES_PER_RADIAN = STRAIGHT / Math.PI;

    /** Converts radians to degrees. */
    export const fromRadians = (radians: number) => radians * DEGREES_PER_RADIAN;

    /** Converts degrees to radians. */
    export const toRadians = (degrees: number) => degrees * RADIANS_PER_DEGREE;

    /**
     * The same bearing written the one way this library writes it.
     *
     * Every answer here comes back through this, so two bearings that point the same way are the same
     * number and can be compared with `===`.
     *
     * @param degrees Any bearing, however many turns it has accumulated.
     * @returns The bearing from `-180` (exclusive) to `180` (inclusive).
     */
    export const wrap = (degrees: number) => {
        const behind = STRAIGHT - degrees;

        return STRAIGHT - (((behind % FULL_TURN) + FULL_TURN) % FULL_TURN);
    };

    /**
     * The same amount of turning written the one way, as a quantity rather than as a bearing.
     *
     * The companion to {@link wrap} and the difference is which question is being asked. A bearing is a
     * position and its two neighbors either side of straight back are as near as each other, so it is
     * written from `-180`; an amount of turning has a direction and no negative form, so a sweep of `370`
     * is a sweep of `10` and a sweep of `-10` is a sweep of `350`.
     *
     * @param degrees Any amount of turning.
     * @returns It written from `0` (inclusive) to `360` (exclusive).
     */
    export const wrapPositive = (degrees: number) => ((degrees % FULL_TURN) + FULL_TURN) % FULL_TURN;

    /**
     * The turn that takes one bearing to another, the shorter way round.
     *
     * This is what subtracting two bearings means, and writing it as `to - from` is the bug it exists
     * to prevent: that answers `340` where the turn is `-20`, and the error only shows once the two
     * are far enough apart to have crossed the seam.
     *
     * @param from The bearing being turned away from.
     * @param to The bearing being turned toward.
     * @returns The turn in degrees, negative counterclockwise and positive clockwise, from `-180`
     * (exclusive) to `180` (inclusive). Two bearings exactly opposite each other have no shorter way
     * round and report `180`.
     */
    export const getTurn = (from: number, to: number) => wrap(to - from);

    /**
     * How far apart two bearings are, whichever way round they were given.
     *
     * @returns The separation from `0` to `180`. `350` and `10` are twenty degrees apart, not three
     * hundred and forty.
     */
    export const getSeparation = (a: number, b: number) => Math.abs(getTurn(a, b));

    /**
     * Advances a bearing by a turn.
     *
     * @param degrees The bearing to start from.
     * @param turn How far to turn, positive clockwise.
     * @returns Where that lands, written the one way — see {@link wrap}.
     */
    export const add = (degrees: number, turn: number) => wrap(degrees + turn);

    /**
     * A bearing part of the way from one to another, going the shorter way round.
     *
     * @param from The bearing at `0`.
     * @param to The bearing at `1`.
     * @param ratio How far along. Values outside `0` to `1` carry on past the ends, which is what an
     * overshooting easing curve needs.
     * @returns The bearing, written the one way. Two bearings exactly opposite each other turn
     * clockwise, there being no shorter way to prefer.
     */
    export const lerp = (from: number, to: number, ratio: number) => add(from, getTurn(from, to) * ratio);

    /**
     * The bearing halfway between two others, the shorter way round.
     *
     * @returns The bearing, written the one way.
     */
    export const getMidpoint = (a: number, b: number) => lerp(a, b, HALF);

    /**
     * Converts an on-screen bearing back into the one you would need in an unscaled box to point the
     * same way.
     *
     * When a square is stretched into a rectangle, a line drawn at 45° no longer *looks* like it sits
     * at 45°. This undoes that distortion so the visual angle is preserved.
     *
     * @param degrees The bearing as it should appear on screen.
     * @param size The box the bearing lives in. A zero width or height returns it untouched.
     * @returns The corrected bearing, written the one way.
     */
    export const unwarp = (degrees: number, size: { width: number; height: number }) => {
        if (size.width === NOTHING || size.height === NOTHING) return degrees;

        const radians = toRadians(degrees);

        return fromRadians(Math.atan2(Math.sin(radians) / size.width, Math.cos(radians) / size.height));
    };
}
