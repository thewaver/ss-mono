import { MathUtils } from "@thewaver/ss-utils";

import type { NumberInputRangeDefs, NumberInputSeparators, NumberInputStepDefs } from "./NumberInput.types";

/** How many decimal places stepping will work to. Beyond this, floating point cannot represent the difference anyway. */
const MAX_STEP_DECIMALS = 12;

/** Both spellings of the exponent marker. */
const EXPONENT_CHARACTERS = "eE";

/** The decimal point `Number` reads, which is also what a value is spelled with before a locale's is swapped in. */
const PLAIN_DECIMAL_SEPARATOR = ".";

/** Separators that read text exactly as `Number` does: a point for the fraction and no grouping at all. */
const PLAIN_SEPARATORS: NumberInputSeparators = { groupSeparator: "", decimalSeparator: PLAIN_DECIMAL_SEPARATOR };

/** Matches one character of white space, which is what several locales group thousands with. */
const WHITESPACE = /\s/;

/**
 * Whether a character groups thousands under the given separators.
 *
 * A locale grouping with a space groups with a non-breaking one that no keyboard types, so under such a
 * locale any white space counts.
 */
const getIsGroupCharacter = (character: string, separators: NumberInputSeparators) =>
    separators.groupSeparator !== "" &&
    (character === separators.groupSeparator ||
        (WHITESPACE.test(separators.groupSeparator) && WHITESPACE.test(character)));

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
     * plus only after the exponent, one decimal separator and only before the exponent, a group
     * separator only straight after a digit of the whole part, and an exponent only once and only after a
     * digit.
     *
     * @param text What the user has typed.
     * @param separators The characters that mark the fraction and group thousands, usually read from a
     * locale with `DecimalUtils.getSeparators`. Left out, the fraction is marked with a point and nothing
     * groups, which is how `Number` reads text.
     * @returns The text with impossible characters dropped.
     */
    export const sanitizeText = (text: string, separators: NumberInputSeparators = PLAIN_SEPARATORS) => {
        let result = "";
        let hasPoint = false;
        let hasExponent = false;
        let hasDigit = false;

        for (const character of text) {
            const previous = result[result.length - 1] ?? "";
            const isAfterExponent = hasExponent && EXPONENT_CHARACTERS.includes(previous);
            const isAfterDigit = previous >= "0" && previous <= "9";

            if (character >= "0" && character <= "9") {
                result += character;

                if (!hasExponent) hasDigit = true;
            } else if (character === "-" && (result === "" || isAfterExponent)) {
                result += character;
            } else if (character === "+" && isAfterExponent) {
                result += character;
            } else if (character === separators.decimalSeparator && !hasPoint && !hasExponent) {
                result += character;
                hasPoint = true;
            } else if (getIsGroupCharacter(character, separators) && isAfterDigit && !hasPoint && !hasExponent) {
                result += character;
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
     * Group separators are dropped and the decimal separator is read as the fraction, so under German
     * separators `1.000` is one thousand and `1,5` is one and a half.
     *
     * @param text The field's text, already sanitized.
     * @param separators The characters that mark the fraction and group thousands. Left out, the text is
     * read as `Number` reads it.
     * @returns The number, or `undefined` for empty text and for text that is not yet a number.
     * Infinities are refused as well.
     */
    export const parseValue = (text: string, separators: NumberInputSeparators = PLAIN_SEPARATORS) => {
        if (text === "") return undefined;

        let plain = "";

        for (const character of text) {
            if (getIsGroupCharacter(character, separators)) continue;

            plain += character === separators.decimalSeparator ? PLAIN_DECIMAL_SEPARATOR : character;
        }

        if (plain === "") return undefined;

        const parsed = Number(plain);

        return Number.isFinite(parsed) ? parsed : undefined;
    };

    /**
     * Writes a value as the field's text.
     *
     * The fraction is marked with the given decimal separator and nothing is grouped, so every finite value,
     * however large or small, reads back through {@link parseValue} as the same number.
     *
     * @param value The value. Missing gives an empty field.
     * @param separators The characters that mark the fraction and group thousands. Left out, the value is
     * written as `String` writes it.
     */
    export const formatValue = (value: number | undefined, separators: NumberInputSeparators = PLAIN_SEPARATORS) =>
        value === undefined ? "" : String(value).replace(PLAIN_DECIMAL_SEPARATOR, separators.decimalSeparator);

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
     * A larger move — PageUp and PageDown — is the same arithmetic over a longer distance: a value between
     * steps first falls back to the step behind it, so ten from `13` with a step of `5` gives `20`, and a
     * distance that is not a whole number of steps lands on the next step past it.
     *
     * @param value The current value, or `undefined` for an empty field.
     * @param direction `1` for up, `-1` for down.
     * @param defs.step How far one press moves. A step of zero or less leaves the value alone.
     * @param defs.min The lowest allowed value, if there is one. Also the base steps are counted from.
     * @param defs.max The highest allowed value, if there is one.
     * @param distance How far to move, where it is more than one step. Left out, one step. A distance of
     * zero or less leaves the value alone.
     * @returns The new value, clamped to the bounds.
     */
    export const computeStep = (
        value: number | undefined,
        direction: 1 | -1,
        defs: NumberInputStepDefs,
        distance = defs.step,
    ) => {
        const base = defs.min ?? 0;

        if (value === undefined) return clampValue(base, defs);

        const decimals = Math.min(
            Math.max(
                getDecimalCount(defs.step),
                getDecimalCount(distance),
                getDecimalCount(base),
                getDecimalCount(value),
            ),
            MAX_STEP_DECIMALS,
        );
        const scale = 10 ** decimals;
        const stepUnits = Math.round(defs.step * scale);
        const distanceUnits = Math.round(distance * scale);

        if (stepUnits <= 0 || distanceUnits <= 0) return clampValue(value, defs);

        const snapToStep = (units: number, towards: 1 | -1) =>
            (towards > 0 ? Math.ceil(units / stepUnits) : Math.floor(units / stepUnits)) * stepUnits;

        const offsetUnits = Math.round((value - base) * scale);
        const startUnits = snapToStep(offsetUnits, direction > 0 ? -1 : 1);
        const nextUnits = snapToStep(startUnits + direction * distanceUnits, direction);

        return clampValue(MathUtils.roundToDecimalPlaces(base + nextUnits / scale, decimals), defs);
    };
}
