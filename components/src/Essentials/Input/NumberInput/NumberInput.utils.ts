import { MathUtils } from "@thewaver/ss-utils";

import type { NumberInputRangeDefs, NumberInputStepDefs } from "./NumberInput.types";

/** How many decimal places stepping will work to. Beyond this, floating point cannot represent the difference anyway. */
const MAX_STEP_DECIMALS = 12;

/** Both spellings of the exponent marker. */
const EXPONENT_CHARACTERS = "eE";

/**
 * How many decimal places a number really has.
 *
 * Reads the exponent as well as the fraction, so `1e-3` counts as three rather than none — which is
 * what lets a step of `1e-3` be stepped by exactly.
 */
const getDecimalCount = (value: number) => {
    const [mantissa, exponent] = String(Math.abs(value)).split(/[eE]/);
    const fraction = mantissa.split(".")[1]?.length ?? 0;

    return Math.max(fraction - Number(exponent ?? 0), 0);
};

/**
 * Parses, formats, clamps and steps the value of a number field.
 *
 * The field holds text rather than a number, because a number cannot represent what a user is
 * part-way through typing: `-`, `1.`, and `2e` are all reasonable things to have on screen and none
 * of them is a value yet.
 */
export namespace NumberInputUtils {
    /**
     * Strips everything from typed text that could not be part of a number.
     *
     * What survives is text on its way to being a number, not necessarily a number yet, so a trailing
     * point or a lone minus is kept — deleting them as the user types would make the field impossible to
     * type in. The rules are positional: a minus only at the start or straight after the exponent, a
     * plus only after the exponent, one decimal point and only before the exponent, and an exponent only
     * once and only after a digit.
     *
     * @param text What the user has typed.
     * @returns The text with impossible characters dropped.
     */
    export const sanitizeText = (text: string) => {
        let result = "";
        let hasPoint = false;
        let hasExponent = false;
        let hasDigit = false;

        for (const character of text) {
            const previous = result[result.length - 1] ?? "";
            const isAfterExponent = hasExponent && EXPONENT_CHARACTERS.includes(previous);

            if (character >= "0" && character <= "9") {
                result += character;

                if (!hasExponent) hasDigit = true;
            } else if (character === "-" && (result === "" || isAfterExponent)) {
                result += character;
            } else if (character === "+" && isAfterExponent) {
                result += character;
            } else if (character === "." && !hasPoint && !hasExponent) {
                result += character;
                hasPoint = true;
            } else if (EXPONENT_CHARACTERS.includes(character) && !hasExponent && hasDigit) {
                result += character;
                hasExponent = true;
            }
        }

        return result;
    };

    /**
     * Reads the field's text as a number.
     *
     * @param text The field's text, already sanitized.
     * @returns The number, or `undefined` for empty text and for text that is not yet a number.
     * Infinities are refused as well.
     */
    export const parseValue = (text: string) => {
        if (text === "") return undefined;

        const parsed = Number(text);

        return Number.isFinite(parsed) ? parsed : undefined;
    };

    /**
     * Writes a value as the field's text.
     *
     * @param value The value. Missing gives an empty field.
     */
    export const formatValue = (value: number | undefined) => (value === undefined ? "" : String(value));

    /**
     * Whether a value satisfies the field's bounds, both included.
     *
     * @param value The value to test.
     * @param defs.min The lowest allowed value, if there is one.
     * @param defs.max The highest allowed value, if there is one.
     */
    export const getIsInRange = (value: number, defs: NumberInputRangeDefs) =>
        (defs.min === undefined || value >= defs.min) && (defs.max === undefined || value <= defs.max);

    /**
     * Pulls a value inside the field's bounds.
     *
     * @param value The value to clamp.
     * @param defs.min The lowest allowed value, if there is one.
     * @param defs.max The highest allowed value, if there is one.
     */
    export const clampValue = (value: number, defs: NumberInputRangeDefs) => {
        const floored = defs.min === undefined ? value : Math.max(value, defs.min);

        return defs.max === undefined ? floored : Math.min(floored, defs.max);
    };

    /**
     * The value one press of an arrow or a spinner should produce.
     *
     * Steps are counted from the minimum rather than from zero, so a field starting at `1` with a step
     * of `10` gives `11` and `21` rather than `10` and `20`. A value that is not already on a step moves
     * to the nearest step in the direction pressed rather than a full step past it, which is how a
     * native number input behaves.
     *
     * The arithmetic is done in whole units of the smallest decimal place involved, because stepping
     * `0.1` by `0.2` in floating point does not give `0.3`. An empty field steps to the minimum, or to
     * zero where there is none.
     *
     * @param value The current value, or `undefined` for an empty field.
     * @param direction `1` for up, `-1` for down.
     * @param defs.step How far one press moves. A step of zero or less leaves the value alone.
     * @param defs.min The lowest allowed value, if there is one. Also the base steps are counted from.
     * @param defs.max The highest allowed value, if there is one.
     * @returns The new value, clamped to the bounds.
     */
    export const computeStep = (value: number | undefined, direction: 1 | -1, defs: NumberInputStepDefs) => {
        const base = defs.min ?? 0;

        if (value === undefined) return clampValue(base, defs);

        const decimals = Math.min(
            Math.max(getDecimalCount(defs.step), getDecimalCount(base), getDecimalCount(value)),
            MAX_STEP_DECIMALS,
        );
        const scale = 10 ** decimals;
        const stepUnits = Math.round(defs.step * scale);

        if (stepUnits <= 0) return clampValue(value, defs);

        const offsetUnits = Math.round((value - base) * scale);
        const remainder = ((offsetUnits % stepUnits) + stepUnits) % stepUnits;
        const nextUnits =
            remainder === 0
                ? offsetUnits + direction * stepUnits
                : offsetUnits - remainder + (direction > 0 ? stepUnits : 0);

        return clampValue(MathUtils.roundToDecimalPlaces(base + nextUnits / scale, decimals), defs);
    };
}
