import { RotationUtils } from "@thewaver/ss-utils";

import type { OdometerDirection, OdometerSlot } from "./Odometer.types";

/** Digits on a wheel. */
const DIGIT_COUNT = 10;
/** Zero, as an index. */
const NOTHING = 0;
/** One digit or one step. */
const SINGLE = 1;
/** Marks a slot that is not a digit, and seeds the digit count so the first digit is numbered zero. */
const NO_DIGIT = -1;

/** The digits in the order they appear around a wheel. */
export const ODOMETER_DIGITS = Array.from({ length: DIGIT_COUNT }, (_unused, index) => String(index));

/**
 * Works out how an odometer's digit wheels should turn to reach a new number.
 *
 * The awkward part is that the digits are not independent. A wheel turning from `9` to `0` should
 * carry on forwards rather than winding back nine places, and the whole display should read as one
 * mechanism — so which way the wheels turn is decided from the number as a whole, and the wheels
 * start one after another rather than all at once.
 */
export namespace OdometerUtils {
    /**
     * Splits text into the wheels that turn and the characters that do not.
     *
     * Separators, currency symbols and letters stay put; only the digits get wheels. Each digit carries
     * its number among the digits, which is what the cascade and the comparison are keyed on, so
     * inserting a separator does not disturb them.
     *
     * @param text The text to show.
     */
    export const getSlots = (text: string): OdometerSlot[] => {
        let digitIndex = NO_DIGIT;

        return Array.from(text).map((character) => {
            const isDigit = character >= "0" && character <= "9";

            if (isDigit) digitIndex += SINGLE;

            return {
                kind: isDigit ? "digit" : "fixed",
                character,
                digitIndex: isDigit ? digitIndex : NO_DIGIT,
            };
        });
    };

    /** The digit values of a slot list, separators dropped. */
    export const getDigits = (slots: OdometerSlot[]) =>
        slots.filter((slot) => slot.kind === "digit").map((slot) => Number(slot.character));

    /**
     * Which way the wheels should turn to get from one number to another.
     *
     * Decided from the number as a whole rather than per digit, so the whole display turns one way — the
     * leftmost digit that differs settles it, and a number that has grown a digit is going up whatever
     * its digits say.
     *
     * @param previous The digits currently shown.
     * @param next The digits to show.
     * @returns `"up"`, `"down"`, or `"same"` when nothing has changed.
     */
    export const compareDigits = (previous: number[], next: number[]): OdometerDirection => {
        if (previous.length !== next.length) return next.length > previous.length ? "up" : "down";

        for (let index = NOTHING; index < next.length; index++) {
            if (next[index] === previous[index]) continue;

            return next[index] > previous[index] ? "up" : "down";
        }

        return "same";
    };

    /**
     * The angle a wheel sits at to show a digit.
     *
     * @param digit The digit to show.
     */
    export const getRestingAngle = (digit: number) => RotationUtils.getIndexAngle(digit, DIGIT_COUNT);

    /**
     * How many places a wheel turns, in the direction the whole display is going.
     *
     * The direction is what makes this more than a subtraction: going up from `9` to `0` is one place
     * forwards, and going down it is nine places back. Never the short way round, since one wheel
     * turning against the rest reads as broken.
     *
     * @param previous The digit shown.
     * @param next The digit to show.
     * @param direction Which way the display is turning.
     * @returns The number of places, negative when going down.
     */
    export const computeStepDelta = (previous: number, next: number, direction: OdometerDirection) => {
        if (direction === "down") return -(((previous - next) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;

        return (((next - previous) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;
    };

    /**
     * How far a wheel turns, in degrees.
     *
     * @param previous The digit shown.
     * @param next The digit to show.
     * @param direction Which way the display is turning.
     */
    export const computeAngleDelta = (previous: number, next: number, direction: OdometerDirection) =>
        -computeStepDelta(previous, next, direction) * RotationUtils.getStepAngle(DIGIT_COUNT);

    /**
     * When each wheel should start turning.
     *
     * A wheel waits for every changing wheel to its right, so the movement runs from the last digit
     * towards the first — which is how a mechanical odometer behaves, the tens only moving once the units
     * have come round. Wheels whose digit is unchanged are not counted, so a jump from `199` to `299`
     * does not sit waiting on two wheels that are not going to move.
     *
     * @param previous The digits currently shown.
     * @param next The digits to show.
     * @param delayMs How long one wheel waits behind the next.
     * @returns One delay per digit, in the same order.
     */
    export const computeCascadeDelays = (previous: number[], next: number[], delayMs: number) =>
        next.map((_unused, index) => {
            const behind = next
                .slice(index + SINGLE)
                .filter((digit, offset) => digit !== previous[index + SINGLE + offset]);

            return behind.length * delayMs;
        });
}
