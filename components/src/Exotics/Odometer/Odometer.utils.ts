import { RotationUtils } from "@thewaver/ss-utils";

import type { OdometerDirection, OdometerSlot } from "./Odometer.types";

const DIGIT_COUNT = 10;
const NOTHING = 0;
const SINGLE = 1;
const NO_DIGIT = -1;

export const ODOMETER_DIGITS = Array.from({ length: DIGIT_COUNT }, (_unused, index) => String(index));

export namespace OdometerUtils {
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

    export const getDigits = (slots: OdometerSlot[]) =>
        slots.filter((slot) => slot.kind === "digit").map((slot) => Number(slot.character));

    export const compareDigits = (previous: number[], next: number[]): OdometerDirection => {
        if (previous.length !== next.length) return next.length > previous.length ? "up" : "down";

        for (let index = NOTHING; index < next.length; index++) {
            if (next[index] === previous[index]) continue;

            return next[index] > previous[index] ? "up" : "down";
        }

        return "same";
    };

    export const getRestingAngle = (digit: number) => RotationUtils.getIndexAngle(digit, DIGIT_COUNT);

    export const computeStepDelta = (previous: number, next: number, direction: OdometerDirection) => {
        if (direction === "down") return -(((previous - next) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;

        return (((next - previous) % DIGIT_COUNT) + DIGIT_COUNT) % DIGIT_COUNT;
    };

    export const computeAngleDelta = (previous: number, next: number, direction: OdometerDirection) =>
        -computeStepDelta(previous, next, direction) * RotationUtils.getStepAngle(DIGIT_COUNT);

    export const computeCascadeDelays = (previous: number[], next: number[], delayMs: number) =>
        next.map((_unused, index) => {
            const behind = next
                .slice(index + SINGLE)
                .filter((digit, offset) => digit !== previous[index + SINGLE + offset]);

            return behind.length * delayMs;
        });
}
