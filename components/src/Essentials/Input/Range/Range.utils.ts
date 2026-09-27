import { AngleUtils, MathUtils, Point2d, Point2dUtils } from "@thewaver/ss-utils";

import type { RangeScale, RangeSpan, RangeThumbsDefs, RangeValues } from "./Range.types";

/** A full turn, in degrees. */
const FULL_TURN = 360;
/** Half of anything. */
const HALF = 0.5;
/** The least a track is taken to travel, so a thumb as long as its track still divides by something. */
const MIN_TRACK_TRAVEL_PX = 1;
/** The pointer button a drag starts from. */
const PRIMARY_BUTTON = 0;
/** No pointer buttons held, which is what a pointer passing over the track reports. */
const NO_BUTTONS = 0;

/** How many digits a step carries after the point, so a stepped value can be rounded back to them. */
const countStepDecimals = (step: number) => {
    const [, decimals = ""] = `${step}`.split(".");

    return decimals.length;
};

/**
 * The part of a range that is not about drawing it.
 *
 * The arithmetic a range's thumbs share — where each may go, which one a pointer is nearest, where along the track a
 * pointer sits — and {@link RangeUtils.createThumbs}, which answers the thumbs' events. Also what a pointer-driven
 * range needs beside its own component: rounding a raw reading to the step the keyboard uses, and turning a point
 * into a value by its angle, which is what a knob is.
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

    /**
     * Warns that a range was given neither of its two values, or both.
     *
     * One value drives a single thumb and the pair drives two, and the shape of what was handed in is the only thing
     * that says which, so neither or both leaves the range guessing.
     *
     * @param hasSingle Whether the single value was given.
     * @param hasPair Whether the pair was given.
     * @param names What the caller calls the two props, so the warning names what the consumer wrote.
     */
    export const warnIfAmbiguous = (hasSingle: boolean, hasPair: boolean, names: { single: string; pair: string }) => {
        if (hasSingle !== hasPair) return;

        console.warn(
            `Range: give exactly one of ${names.single} and ${names.pair} — ${names.single} drives a single thumb, ${names.pair} drives a pair.`,
        );
    };

    /**
     * Every thumb's value, in order.
     *
     * @param range The pair, when the range has two thumbs.
     * @param value The single value, when it has one.
     * @param min Where a single thumb sits when it was given no value.
     * @returns Two values for a pair, one otherwise.
     */
    export const computeValues = (range: RangeValues | undefined, value: number | undefined, min: number) =>
        range ? [range.start, range.end] : [value ?? min];

    /**
     * Where each thumb sits as a share of the track.
     *
     * @param values Every thumb's value.
     * @param min The bottom of the scale.
     * @param max The top of the scale.
     * @returns One ratio per thumb, each held inside `0` to `1`.
     */
    export const computeRatios = (values: number[], min: number, max: number) =>
        values.map((value) => MathUtils.clamp01(MathUtils.normalize(value, min, max)));

    /**
     * The stretch of track usually painted as filled.
     *
     * @param ratios Every thumb's ratio, from {@link computeRatios}.
     * @returns The span between the first thumb and the last for a pair, and from the start of the track to the
     * thumb for a single one.
     */
    export const computeFill = (ratios: number[]): RangeSpan =>
        ratios.length > 1 ? { start: ratios[0], end: ratios[ratios.length - 1] } : { start: 0, end: ratios[0] };

    /**
     * The pair with one of its ends moved.
     *
     * @param range The pair as it stands.
     * @param index Which end: `0` is the start, anything else the end.
     * @param value Where it moves to.
     * @returns A new pair, keeping every other field of the one handed in.
     */
    export const computeMovedRange = (range: RangeValues, index: number, value: number): RangeValues =>
        index === 0 ? { ...range, start: value } : { ...range, end: value };

    /**
     * How far one thumb may travel.
     *
     * Thumbs cannot pass each other, and the way that is enforced is that each thumb's floor is its lower neighbor's
     * value and its ceiling its upper neighbor's — the native input's own `min` and `max` — so a drag and a key press
     * are clamped the same way and no guard can be forgotten.
     *
     * @param values Every thumb's value.
     * @param index The thumb.
     * @param min The bottom of the scale.
     * @param max The top of the scale.
     * @returns The thumb's `min` and `max`.
     */
    export const computeThumbBounds = (values: number[], index: number, min: number, max: number) => ({
        min: index === 0 ? min : values[index - 1],
        max: index === values.length - 1 ? max : values[index + 1],
    });

    /**
     * An id or a name made particular to one thumb.
     *
     * A pair's thumbs are `<base>-start` and `<base>-end`, so a label can name each and a form submits both; a single
     * thumb keeps the base as given.
     *
     * @param base The id or name the consumer gave.
     * @param index The thumb.
     * @param count How many thumbs there are.
     * @returns The suffixed id, the base itself for a single thumb, or nothing when there was no base.
     */
    export const suffixForThumb = (base: string | undefined, index: number, count: number) => {
        if (!base || count < 2) return base;

        return `${base}-${index === 0 ? "start" : "end"}`;
    };

    /**
     * The value under a pointer on a straight track.
     *
     * A thumb's center travels from half a thumb in from one end to half a thumb in from the other, never the track's
     * whole length, so the reading is taken over that travel. A vertical track counts up from the bottom and a
     * horizontal one from whichever side the text starts on.
     *
     * @param point The pointer, in the same coordinates as `rect`.
     * @param rect The track's box.
     * @param scale The range's scale and the way its text runs.
     * @returns A value from `min` to `max`, not stepped.
     */
    export const computePointerValue = (
        point: Point2d,
        rect: { left: number; right: number; top: number; bottom: number; width: number; height: number },
        scale: RangeScale,
    ) => {
        const isVertical = scale.orientation === "vertical";
        const span = isVertical ? rect.height : rect.width;
        const horizontalOffset = scale.direction === "rtl" ? rect.right - point.x : point.x - rect.left;
        const offset = isVertical ? rect.bottom - point.y : horizontalOffset;
        const travel = Math.max(span - scale.thumbSize, MIN_TRACK_TRAVEL_PX);
        const ratio = MathUtils.clamp01((offset - scale.thumbSize * HALF) / travel);

        return scale.min + ratio * (scale.max - scale.min);
    };

    /**
     * Which thumb a value is nearest.
     *
     * Two thumbs on the same value cannot move through each other, so which one is taken decides which way it can
     * go. On a tie the side of the value breaks it: above the pile takes the last thumb, below it the first.
     *
     * @param values Every thumb's value.
     * @param pointerValue The value under the pointer.
     * @returns The nearest thumb's index.
     */
    export const computeNearestThumb = (values: number[], pointerValue: number) => {
        const distances = values.map((value) => Math.abs(value - pointerValue));
        const shortest = Math.min(...distances);
        const isTied = distances.filter((distance) => distance === shortest).length > 1;

        if (isTied) return pointerValue > values[0] ? values.length - 1 : 0;

        return distances.indexOf(shortest);
    };

    /**
     * Answers a range's thumb events: which thumb a pointer reaches, the pointer tracking a knob does, the write
     * back onto each native input, and when a change counts as finished.
     *
     * Each thumb is its own native `<input type="range">` laid over the same painter. With two, the one nearest the
     * pointer is raised on `pointermove`, before any button is held, because by `pointerdown` the browser has already
     * chosen its target. Given `computeValueAtPoint`, the range stops the browser dragging its own thumb, captures
     * the pointer, and writes what the function answers on each move — stepped as a key press is, and clamped between
     * the neighboring thumbs — while native input events are ignored and put back.
     *
     * A change is finished when the native `change` fires, which a range input does when a drag lets go and after
     * every key press, or when a tracked pointer is released. The values are noted as a change starts and nothing is
     * reported when they are the same at its end, so a drag that ends where it began says nothing. Nothing is written
     * or reported while the range is disabled, and every refused write is pushed back onto the element.
     *
     * The functions in `defs` are read on every event, so they may answer differently over time. `getValues` is the
     * owner's values; the write back reads it, so a caller whose values update later than the write puts the element
     * back to what it holds until then, and should write each element again once they arrive.
     *
     * @param defs How to read and write the range.
     * @returns The handlers: `syncElement` to write a thumb's value onto its element, `handlePointerDown`,
     * `handlePointerMove`, `handlePointerEnd` (for `pointerup`, `pointercancel` and `lostpointercapture`),
     * `handleKeyDown`, `handleInput` and `handleChange`.
     */
    export const createThumbs = (defs: RangeThumbsDefs) => {
        let valuesAtChangeStart: number[] | undefined;
        let trackedPointerId: number | undefined;
        let trackedThumb = 0;

        const markChangeStart = () => {
            valuesAtChangeStart = defs.getValues();
        };

        const reportChangeEnd = () => {
            const values = defs.getValues();
            const startValues = valuesAtChangeStart;

            valuesAtChangeStart = undefined;

            if (defs.getIsDisabled()) return;

            if (startValues && startValues.every((value, index) => value === values[index])) return;

            defs.onChangeEnd(values);
        };

        const syncElement = (element: HTMLInputElement, index: number) => {
            element.value = `${defs.getValues()[index]}`;
        };

        const raiseNearestThumb = (e: PointerEvent, element: HTMLInputElement) => {
            const values = defs.getValues();

            if (values.length < 2) return;

            const pointerValue = computePointerValue(
                { x: e.clientX, y: e.clientY },
                element.getBoundingClientRect(),
                defs.getScale(),
            );

            defs.setActiveThumb(computeNearestThumb(values, pointerValue));
        };

        const readTrackedValue = (e: PointerEvent, element: HTMLInputElement) =>
            defs.getComputeValueAtPoint()?.({ x: e.clientX, y: e.clientY }, element.getBoundingClientRect()) ??
            defs.getValues()[trackedThumb];

        const writeTrackedValue = (rawValue: number) => {
            if (defs.getIsDisabled()) return;

            const values = defs.getValues();
            const scale = defs.getScale();
            const bounds = computeThumbBounds(values, trackedThumb, scale.min, scale.max);
            const value = MathUtils.clamp(computeSteppedValue(rawValue, scale), bounds.min, bounds.max);

            if (value !== values[trackedThumb]) defs.setValue(trackedThumb, value);
        };

        const startTracking = (e: PointerEvent, element: HTMLInputElement) => {
            if (e.button !== PRIMARY_BUTTON || defs.getIsDisabled()) return;

            e.preventDefault();

            const rawValue = readTrackedValue(e, element);

            trackedThumb = computeNearestThumb(defs.getValues(), rawValue);
            trackedPointerId = e.pointerId;

            defs.setActiveThumb(trackedThumb);
            element.setPointerCapture(e.pointerId);
            defs.getElement(trackedThumb)?.focus({ preventScroll: true });
            writeTrackedValue(rawValue);
        };

        return {
            syncElement,
            handlePointerDown: (e: PointerEvent, element: HTMLInputElement) => {
                markChangeStart();

                if (defs.getComputeValueAtPoint()) startTracking(e, element);
                else raiseNearestThumb(e, element);
            },
            handlePointerMove: (e: PointerEvent, element: HTMLInputElement) => {
                if (trackedPointerId === e.pointerId) writeTrackedValue(readTrackedValue(e, element));
                else if (e.buttons === NO_BUTTONS && !defs.getComputeValueAtPoint()) raiseNearestThumb(e, element);
            },
            handlePointerEnd: (e: PointerEvent) => {
                if (trackedPointerId !== e.pointerId) return;

                trackedPointerId = undefined;
                reportChangeEnd();
            },
            handleKeyDown: markChangeStart,
            handleInput: (element: HTMLInputElement, index: number) => {
                if (!defs.getIsDisabled() && trackedPointerId === undefined) {
                    defs.setValue(index, element.valueAsNumber);
                }

                syncElement(element, index);
            },
            handleChange: () => {
                if (defs.getComputeValueAtPoint() && valuesAtChangeStart === undefined) return;

                reportChangeEnd();
            },
        };
    };
}
