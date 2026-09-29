import { TextSyncUtils } from "../TextSync/TextSync.utils";
import type { MaskedFieldDefs } from "./MaskedField.types";

/**
 * Keeps a text field showing a formatted value while the underlying value stays typed.
 *
 * A masked field has two representations of the same thing and both can be edited: the text the
 * user is typing and the value the consumer holds. Keeping them in step is the whole problem, and
 * the awkward part is that half-typed text is not a value at all — `12/` is not a date — so the
 * value must not be disturbed while the user is mid-way through. These are the rules that decide it;
 * wiring them to a live field is each framework's.
 *
 * Digits and formatting are kept apart throughout: what the user types is reduced to digits, the
 * digits are what the value is built from, and the separators are re-inserted for display. That is
 * why deleting a slash in a date field does nothing visible — the slash was never data.
 */
export namespace MaskedFieldUtils {
    /**
     * A value as the field spells it.
     *
     * @param value The value.
     * @param defs How the field turns a value into digits and digits into text.
     */
    export const formatValue = <T>(value: T, defs: Pick<MaskedFieldDefs<T>, "toDigits" | "formatDigits">) =>
        defs.formatDigits(defs.toDigits(value));

    /**
     * The text a field shows for a value, which is nothing at all for no value.
     *
     * @param value The value, or `undefined`.
     * @param defs How the field turns a value into digits and digits into text.
     */
    export const computeText = <T>(
        value: T | undefined,
        defs: Pick<MaskedFieldDefs<T>, "toDigits" | "formatDigits">,
    ) => (value === undefined ? "" : formatValue(value, defs));

    /**
     * The digits in what a field shows.
     *
     * @param text The field's text.
     * @param defs The field's own reading of its digits, if it has one; the mask's digits otherwise.
     */
    export const readDigits = <T>(text: string, defs: Pick<MaskedFieldDefs<T>, "readDigits">) =>
        (defs.readDigits ?? TextSyncUtils.getMaskedDigits)(text);

    /**
     * Whether what is entered is wrong.
     *
     * Nothing entered is never wrong. Digits no value could start with are wrong at once. An entry that is merely
     * short is not called wrong until the user has left the field, which is what stops a date field going red at
     * the first keystroke. A full entry is wrong when it makes no possible value.
     *
     * @param digits The digits entered.
     * @param hasLeft Whether the user has left the field since last typing in it.
     * @param defs How many digits a complete entry has, which sequences are impossible outright, and how to read a
     * value from digits.
     */
    export const computeHasIssue = <T>(
        digits: string,
        hasLeft: boolean,
        defs: Pick<MaskedFieldDefs<T>, "getDigitCount" | "getHasImpossibleDigits" | "fromDigits">,
    ) => {
        const digitCount = defs.getDigitCount();

        if (digits.length === 0) return false;
        if (defs.getHasImpossibleDigits(digits)) return true;
        if (digitCount !== undefined && digits.length < digitCount) return hasLeft;

        return defs.fromDigits(digits) === undefined;
    };

    /**
     * The value that typing these digits commits, if typing them commits anything.
     *
     * A half-finished entry commits nothing, so the last good value is left alone rather than cleared; clearing
     * every digit commits no value.
     *
     * @param digits The digits entered.
     * @param defs How to read a value from digits.
     * @returns `{ value }` to commit, where `value` is `undefined` for an emptied field, or `undefined` when the
     * entry is incomplete and the value should stay as it is.
     */
    export const computeTypedValue = <T>(
        digits: string,
        defs: Pick<MaskedFieldDefs<T>, "fromDigits">,
    ): { value: T | undefined } | undefined => {
        const value = defs.fromDigits(digits);

        if (digits.length > 0 && value === undefined) return;

        return { value };
    };
}
