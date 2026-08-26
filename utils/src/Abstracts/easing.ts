import { MathUtils } from "./math.js";

/**
 * A timing curve.
 *
 * Takes how far through the elapsed time an animation is, as a ratio where `0` is the start and `1` is the
 * end, and answers how far through the change it should be at that instant. Most curves answer within `0` to
 * `1` as well, but the `back` and `elastic` families deliberately leave that range in the middle so that the
 * motion overshoots and settles back; a caller feeding the result to something that cannot take values
 * outside the range has to clamp on its own.
 */
export type EasingFn = (ratio: number) => number;

type BezierCoefficients = {
    a: number;
    b: number;
    c: number;
};

const NEWTON_ITERATIONS = 8;
const NEWTON_MIN_SLOPE = 0.001;
const BISECTION_ITERATIONS = 24;
const SOLVE_EPSILON = 0.0000001;

const CSS_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const CSS_EASE_IN: [number, number, number, number] = [0.42, 0, 1, 1];
const CSS_EASE_OUT: [number, number, number, number] = [0, 0, 0.58, 1];
const CSS_EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

const BACK_OVERSHOOT = 1.70158;
const ELASTIC_PERIOD = (2 * Math.PI) / 3;
const ELASTIC_PHASE = 10.75;
const ELASTIC_DECAY = 10;
const EXPO_DECAY = 10;
const BOUNCE_FACTOR = 7.5625;
const BOUNCE_DIVISOR = 2.75;
const HALF = 0.5;

const getCoefficients = (first: number, second: number): BezierCoefficients => {
    const c = 3 * first;
    const b = 3 * (second - first) - c;

    return { a: 1 - c - b, b, c };
};

const evaluateBezier = ({ a, b, c }: BezierCoefficients, parameter: number) =>
    ((a * parameter + b) * parameter + c) * parameter;

const evaluateBezierSlope = ({ a, b, c }: BezierCoefficients, parameter: number) =>
    (3 * a * parameter + 2 * b) * parameter + c;

const solveBezierParameter = (coefficients: BezierCoefficients, ratio: number) => {
    let parameter = ratio;

    for (let iteration = 0; iteration < NEWTON_ITERATIONS; iteration++) {
        const distance = evaluateBezier(coefficients, parameter) - ratio;

        if (Math.abs(distance) < SOLVE_EPSILON) return parameter;

        const slope = evaluateBezierSlope(coefficients, parameter);

        if (Math.abs(slope) < NEWTON_MIN_SLOPE) break;

        parameter -= distance / slope;
    }

    let low = 0;
    let high = 1;

    parameter = ratio;

    for (let iteration = 0; iteration < BISECTION_ITERATIONS; iteration++) {
        const distance = evaluateBezier(coefficients, parameter) - ratio;

        if (Math.abs(distance) < SOLVE_EPSILON) return parameter;

        if (distance < 0) low = parameter;
        else high = parameter;

        parameter = (low + high) * HALF;
    }

    return parameter;
};

export namespace EasingUtils {
    /**
     * Wraps a curve so that it never sees a ratio outside `0` to `1`.
     *
     * A caller that computes elapsed over duration can hand over a slightly negative number on the frame an
     * animation is scheduled, or slightly over `1` on the frame it finishes late, and a raw power or
     * exponential curve answers something wild for either. Clamping the input rather than the output is what
     * keeps the overshooting families usable: `back` and `elastic` still leave the `0` to `1` range in the
     * middle, which is the point of them, but they start at exactly `0` and end at exactly `1`.
     *
     * Every curve in this namespace is already wrapped. This is exported for curves a caller writes itself.
     *
     * @param easing The curve to protect.
     * @returns The same curve, reading a ratio pinned into `0` to `1`.
     */
    export const clamped =
        (easing: EasingFn): EasingFn =>
        (ratio) =>
            easing(MathUtils.clamp01(ratio));

    /**
     * Turns a curve that starts slowly into one that finishes slowly.
     *
     * The curve is rotated a half turn about its own centre: it is read backwards, and the answer is
     * subtracted from `1`. So a curve that creeps away from the start and arrives fast becomes one that
     * leaves fast and creeps into the end, which is what every `easeOut` in this namespace is.
     *
     * @param easing The curve to turn around.
     * @returns The curve with its slow end and its fast end swapped.
     */
    export const reversed =
        (easing: EasingFn): EasingFn =>
        (ratio) =>
            1 - easing(1 - ratio);

    /**
     * Runs a curve into the first half of the motion and its reflection into the second.
     *
     * The whole curve is squeezed into the first half at half scale, and the reversed curve into the second
     * half, so a shape that starts slowly becomes one that starts slowly, runs fastest across the middle, and
     * finishes slowly. That is what every `easeInOut` in this namespace is.
     *
     * @param easing The curve to use for the first half.
     * @returns The curve run forwards and then reflected.
     */
    export const mirrored =
        (easing: EasingFn): EasingFn =>
        (ratio) =>
            ratio < HALF ? easing(ratio * 2) * HALF : 1 - easing(2 - ratio * 2) * HALF;

    /**
     * Builds a curve from the two control points of a cubic Bezier, exactly as CSS `cubic-bezier()` does.
     *
     * The curve runs from `(0, 0)` to `(1, 1)`, and the two control points pull it away from the straight
     * line between them. Horizontal is time and vertical is progress, so a point held low and to the right
     * delays the motion, and one held high and to the left rushes it.
     *
     * The awkward part is that a Bezier is not a function of time: both of its coordinates are driven by a
     * third hidden number, so asking what the progress is at a given instant means first working out which
     * value of that hidden number lands on the instant asked about. Newton's method does that here, and
     * converges within a few steps for the curves people actually write. Where the curve is too flat for it —
     * flatness makes each next guess enormous — the search falls back to repeatedly halving the interval,
     * which is slower but cannot run away.
     *
     * The horizontal coordinates are pinned into `0` to `1`, as CSS requires, because a control point outside
     * that range lets the curve double back in time and no single progress value exists at such an instant.
     * The vertical ones are left alone, so overshoot above `1` and undershoot below `0` are available.
     *
     * @param x1 Horizontal coordinate of the first control point, pinned into `0` to `1`.
     * @param y1 Vertical coordinate of the first control point; may sit outside `0` to `1`.
     * @param x2 Horizontal coordinate of the second control point, pinned into `0` to `1`.
     * @param y2 Vertical coordinate of the second control point; may sit outside `0` to `1`.
     * @returns The curve those two control points describe.
     */
    export const getCubicBezier = (x1: number, y1: number, x2: number, y2: number): EasingFn => {
        const xCoefficients = getCoefficients(MathUtils.clamp01(x1), MathUtils.clamp01(x2));
        const yCoefficients = getCoefficients(y1, y2);

        return (ratio) => {
            if (ratio <= 0) return 0;
            if (ratio >= 1) return 1;

            return evaluateBezier(yCoefficients, solveBezierParameter(xCoefficients, ratio));
        };
    };

    /** Progress tracks time exactly, at one constant speed from start to finish. */
    export const linear: EasingFn = (ratio) => MathUtils.clamp01(ratio);

    /** The CSS `ease` keyword: a brisk start and then a long settle. What a CSS transition uses by default. */
    export const ease = getCubicBezier(...CSS_EASE);

    /** The CSS `ease-in` keyword: starts slowly and is still gaining speed when it arrives. */
    export const easeIn = getCubicBezier(...CSS_EASE_IN);

    /** The CSS `ease-out` keyword: leaves at full speed and slows into the finish. */
    export const easeOut = getCubicBezier(...CSS_EASE_OUT);

    /** The CSS `ease-in-out` keyword: slow at both ends, fastest across the middle. */
    export const easeInOut = getCubicBezier(...CSS_EASE_IN_OUT);

    /** Squares the ratio: the gentlest of the accelerating curves. */
    export const easeInQuad = clamped((ratio) => ratio * ratio);

    /** The gentlest decelerating curve, {@link easeInQuad} run backwards. */
    export const easeOutQuad = reversed(easeInQuad);

    /** The gentlest of the slow-at-both-ends curves, {@link easeInQuad} mirrored about the midpoint. */
    export const easeInOutQuad = mirrored(easeInQuad);

    /** Cubes the ratio: noticeably steeper at the end than {@link easeInQuad}. */
    export const easeInCubic = clamped((ratio) => ratio ** 3);

    /** {@link easeInCubic} run backwards, so the motion arrives slowly. */
    export const easeOutCubic = reversed(easeInCubic);

    /** {@link easeInCubic} mirrored about the midpoint, slow at both ends. */
    export const easeInOutCubic = mirrored(easeInCubic);

    /** Raises the ratio to the fourth power: steeper again than {@link easeInCubic}. */
    export const easeInQuart = clamped((ratio) => ratio ** 4);

    /** {@link easeInQuart} run backwards, so the motion arrives slowly. */
    export const easeOutQuart = reversed(easeInQuart);

    /** {@link easeInQuart} mirrored about the midpoint, slow at both ends. */
    export const easeInOutQuart = mirrored(easeInQuart);

    /** Raises the ratio to the fifth power: the steepest of the plain power curves here. */
    export const easeInQuint = clamped((ratio) => ratio ** 5);

    /** {@link easeInQuint} run backwards, so the motion arrives slowly. */
    export const easeOutQuint = reversed(easeInQuint);

    /** {@link easeInQuint} mirrored about the midpoint, slow at both ends. */
    export const easeInOutQuint = mirrored(easeInQuint);

    /**
     * The first quarter of a cosine wave, which leaves the start with no speed at all and gains it smoothly.
     *
     * Softer than any of the power curves: where those pile most of the travel into the last moments, this
     * spreads it out, so the motion reads as unhurried rather than as a lunge.
     */
    export const easeInSine = clamped((ratio) => 1 - Math.cos(ratio * Math.PI * HALF));

    /** {@link easeInSine} run backwards, so the motion arrives with no speed at all. */
    export const easeOutSine = reversed(easeInSine);

    /** {@link easeInSine} mirrored about the midpoint, the softest of the slow-at-both-ends curves. */
    export const easeInOutSine = mirrored(easeInSine);

    /**
     * Doubles the progress a fixed number of times across the span, the most violent start available here.
     *
     * The first half of the time covers about three percent of the distance, so whatever is moving appears
     * frozen and then bolts. The start is pinned to exactly `0`, because the doubling on its own never quite
     * reaches it.
     */
    export const easeInExpo = clamped((ratio) => (ratio <= 0 ? 0 : 2 ** (EXPO_DECAY * ratio - EXPO_DECAY)));

    /** {@link easeInExpo} run backwards: bolts away from the start and drifts into the finish. */
    export const easeOutExpo = reversed(easeInExpo);

    /** {@link easeInExpo} mirrored about the midpoint, near-motionless at both ends. */
    export const easeInOutExpo = mirrored(easeInExpo);

    /**
     * Traces the corner of a circle, so the motion is still speeding up at the instant it arrives.
     *
     * The curve is vertical where it ends: the change is at its fastest exactly as it stops, which makes this
     * the abrupt one to reach for when something should look cut short rather than settled.
     */
    export const easeInCirc = clamped((ratio) => 1 - Math.sqrt(1 - ratio * ratio));

    /** {@link easeInCirc} run backwards: leaves at full speed and then eases into the finish. */
    export const easeOutCirc = reversed(easeInCirc);

    /** {@link easeInCirc} mirrored about the midpoint, slow at both ends and abrupt through the middle. */
    export const easeInOutCirc = mirrored(easeInCirc);

    /**
     * Pulls back before setting off, like a wind-up.
     *
     * Progress goes negative for roughly the first third, so whatever is moving retreats a little way past
     * its starting position before it travels. The result therefore leaves the `0` to `1` range, and a caller
     * feeding it to something that cannot take a negative has to clamp for itself.
     */
    export const easeInBack = clamped((ratio) => (BACK_OVERSHOOT + 1) * ratio ** 3 - BACK_OVERSHOOT * ratio * ratio);

    /** {@link easeInBack} run backwards: sails past the destination and comes back to it, rising above `1`. */
    export const easeOutBack = reversed(easeInBack);

    /** {@link easeInBack} mirrored about the midpoint: pulls back at the start and overshoots at the end. */
    export const easeInOutBack = mirrored(easeInBack);

    /**
     * Wobbles around the starting position with growing swings before finally departing.
     *
     * A sine wave multiplied by a rising exponential, so the oscillation is imperceptible at first and
     * violent by the end. Progress crosses `0` several times and dips below it, so like the `back` family
     * this leaves the `0` to `1` range and a caller that cannot take that has to clamp.
     *
     * Both ends are pinned, because the wave on its own does not land on `0` or `1` exactly.
     */
    export const easeInElastic = clamped((ratio) => {
        if (ratio <= 0) return 0;
        if (ratio >= 1) return 1;

        return (
            -(2 ** (ELASTIC_DECAY * ratio - ELASTIC_DECAY)) * Math.sin((ratio * 10 - ELASTIC_PHASE) * ELASTIC_PERIOD)
        );
    });

    /** {@link easeInElastic} run backwards: shoots to the destination and rings around it before settling. */
    export const easeOutElastic = reversed(easeInElastic);

    /** {@link easeInElastic} mirrored about the midpoint, ringing at both ends. */
    export const easeInOutElastic = mirrored(easeInElastic);

    /**
     * Drops to the destination and bounces off it, each rebound shorter than the one before.
     *
     * This is the one member of the family written out directly rather than derived, because the falling
     * shape is the one everybody pictures when they hear the word. It is four parabolas laid end to end, and
     * the result stays within `0` to `1` throughout — a bounce never passes through the surface it lands on.
     */
    export const easeOutBounce = clamped((ratio) => {
        if (ratio < 1 / BOUNCE_DIVISOR) return BOUNCE_FACTOR * ratio * ratio;

        if (ratio < 2 / BOUNCE_DIVISOR) {
            const shifted = ratio - 1.5 / BOUNCE_DIVISOR;

            return BOUNCE_FACTOR * shifted * shifted + 0.75;
        }

        if (ratio < 2.5 / BOUNCE_DIVISOR) {
            const shifted = ratio - 2.25 / BOUNCE_DIVISOR;

            return BOUNCE_FACTOR * shifted * shifted + 0.9375;
        }

        const shifted = ratio - 2.625 / BOUNCE_DIVISOR;

        return BOUNCE_FACTOR * shifted * shifted + 0.984375;
    });

    /** {@link easeOutBounce} run backwards: small rebounds at the start that grow into the departure. */
    export const easeInBounce = reversed(easeOutBounce);

    /** {@link easeInBounce} mirrored about the midpoint, bouncing at both ends. */
    export const easeInOutBounce = mirrored(easeInBounce);
}
