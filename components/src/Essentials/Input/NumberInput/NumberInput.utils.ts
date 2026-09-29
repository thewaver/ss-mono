import { MathUtils } from "@thewaver/ss-utils";

import type {
    NumberInputKeyMove,
    NumberInputRangeDefs,
    NumberInputSeparators,
    NumberInputStepDefs,
    NumberInputStepRepeater,
} from "./NumberInput.types";

/** How many decimal places stepping will work to. Beyond this, floating point cannot represent the difference anyway. */
const MAX_STEP_DECIMALS = 12;

/** How many steps PageUp and PageDown move when the field is not told otherwise. */
const PAGE_STEP_MULTIPLE = 10;

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

    /**
     * How far PageUp and PageDown move the value.
     *
     * @param pageStep The distance the consumer asked for, if any.
     * @param step How far one step moves.
     * @returns `pageStep`, or ten steps when it is left out.
     */
    export const computePageStep = (pageStep: number | undefined, step: number) =>
        pageStep ?? step * PAGE_STEP_MULTIPLE;

    /**
     * Whether the field holds a number its bounds do not allow.
     *
     * An empty or half-typed field holds no number, so it has no range issue however it reads.
     *
     * @param value The number the field's text reads as, or `undefined`.
     * @param defs The field's bounds.
     */
    export const getHasRangeIssue = (value: number | undefined, defs: NumberInputRangeDefs) =>
        value !== undefined && !getIsInRange(value, defs);

    /**
     * Whether the number sits at or below the lowest allowed value, which is where a step down has nowhere to go.
     *
     * @param value The number the field's text reads as, or `undefined`. An empty field is at neither end.
     * @param defs The field's bounds. With no minimum, nothing is at it.
     */
    export const getIsAtMin = (value: number | undefined, defs: NumberInputRangeDefs) =>
        defs.min !== undefined && value !== undefined && value <= defs.min;

    /**
     * Whether the number sits at or above the highest allowed value, which is where a step up has nowhere to go.
     *
     * @param value The number the field's text reads as, or `undefined`. An empty field is at neither end.
     * @param defs The field's bounds. With no maximum, nothing is at it.
     */
    export const getIsAtMax = (value: number | undefined, defs: NumberInputRangeDefs) =>
        defs.max !== undefined && value !== undefined && value >= defs.max;

    /**
     * What a key pressed in the field does to its value, if anything.
     *
     * The arrows step once, PageUp and PageDown step by the page distance, and Home and End jump to the bounds —
     * but only to a bound that exists, so a field with no maximum leaves End to the caret. Every other key is the
     * text's, and answers nothing. Whether the field may be changed at all is the caller's to check first.
     *
     * @param key The key, as `KeyboardEvent.key` spells it.
     * @param defs The field's bounds.
     * @param pageStep How far PageUp and PageDown move, as {@link computePageStep} gives it.
     * @returns A step to take, as a direction and an optional distance for {@link computeStep}; a value to set
     * outright; or `undefined` when the key is not the field's, in which case its default must not be prevented.
     */
    export const computeKeyMove = (
        key: string,
        defs: NumberInputRangeDefs,
        pageStep: number,
    ): NumberInputKeyMove | undefined => {
        if (key === "ArrowUp") return { direction: 1 };
        if (key === "ArrowDown") return { direction: -1 };
        if (key === "PageUp") return { direction: 1, distance: pageStep };
        if (key === "PageDown") return { direction: -1, distance: pageStep };
        if (key === "Home" && defs.min !== undefined) return { value: defs.min };
        if (key === "End" && defs.max !== undefined) return { value: defs.max };

        return undefined;
    };

    /**
     * The value a field settles on when it is left.
     *
     * A number outside the bounds is pulled inside them, which is deferred to this point because clamping while the
     * reader types would make a second digit untypeable. An empty field stays empty.
     *
     * @param value The number the field's text reads as, or `undefined`.
     * @param defs The field's bounds.
     */
    export const computeSettledValue = (value: number | undefined, defs: NumberInputRangeDefs) =>
        value === undefined ? undefined : clampValue(value, defs);

    /**
     * Repeats a step while a stepper button is held, the way a native spinner does.
     *
     * Starting steps once straight away, then waits the delay, then steps again on every interval until stopped —
     * so a tap stays a single step. A first step that is refused starts nothing. Starting again while repeating
     * stops the earlier repeat first, so only one is ever running.
     *
     * @param defs.getDelayMs How long to wait before repeating, read each time a repeat starts.
     * @param defs.getIntervalMs How often to repeat once it has started, read as the repeat begins.
     * @returns `start(step)`, which takes a function making one step and answering whether it moved, and answers
     * `false` when the first step was refused; and `stop()`, which ends any repeat and answers whether one was
     * pending or running. Stopping twice is harmless, and the repeater can be started again after either.
     */
    export const createStepRepeater = (defs: {
        getDelayMs: () => number;
        getIntervalMs: () => number;
    }): NumberInputStepRepeater => {
        let repeatDelay: ReturnType<typeof setTimeout> | undefined;
        let repeatInterval: ReturnType<typeof setInterval> | undefined;

        const stop = () => {
            const wasStepping = repeatDelay !== undefined || repeatInterval !== undefined;

            clearTimeout(repeatDelay);
            clearInterval(repeatInterval);

            repeatDelay = undefined;
            repeatInterval = undefined;

            return wasStepping;
        };

        const start = (step: () => boolean) => {
            stop();

            if (!step()) return false;

            repeatDelay = setTimeout(() => {
                repeatInterval = setInterval(step, defs.getIntervalMs());
            }, defs.getDelayMs());

            return true;
        };

        return { start, stop };
    };
}
