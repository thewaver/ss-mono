import { createEffect, createMemo, createSignal, untrack } from "solid-js";

import { TextSyncUtils } from "../TextSync/TextSync.utils";
import type { MaskedFieldDefs, MaskedFieldHandle } from "./MaskedField.types";

/**
 * Keeps a text field showing a formatted value while the underlying value stays typed.
 *
 * A masked field has two representations of the same thing and both can be edited: the text the
 * user is typing and the value the consumer holds. Keeping them in step is the whole problem, and
 * the awkward part is that half-typed text is not a value at all — `12/` is not a date — so the
 * value must not be disturbed while the user is mid-way through.
 */
export namespace MaskedFieldUtils {
    /**
     * Wires one masked field's text and value together.
     *
     * The rules that fall out of it. Typing updates the value only when the digits make a complete,
     * possible value, so a half-finished entry leaves the last good value alone rather than clearing
     * it. A value arriving from outside rewrites the text, unless the user is mid-edit with the value
     * already cleared. And an incomplete entry is not called an error until the user leaves the field,
     * which is what stops a date field going red at the first keystroke.
     *
     * Digits and formatting are kept apart throughout: what the user types is reduced to digits, the
     * digits are what the value is built from, and the separators are re-inserted for display. That is
     * why deleting a slash in a date field does nothing visible — the slash was never data.
     *
     * @param defs The field's own rules: how to read the value, how to turn it into digits and back,
     * how to format digits for display, how many digits a complete entry has, which digit sequences are
     * impossible outright, and how to compare two values.
     * @returns A handle to attach to the input. `textSignal` is what the input binds to, `getDigits`
     * is the digits currently entered, `getHasIssue` says whether what is entered is wrong,
     * `formatValue` formats a value for display, `commit` sets the value directly, `refresh` rewrites
     * the text from the value, and `onInput` and `onBlur` must be called from the input's own handlers
     * for the leave-the-field rule to work.
     */
    export const createField = <T>(defs: MaskedFieldDefs<T>): MaskedFieldHandle<T> => {
        const [getHasLeft, setHasLeft] = createSignal(false);

        const formatValue = (value: T) => defs.formatDigits(defs.toDigits(value));

        const getText = () => {
            const value = defs.getValue();

            return value === undefined ? "" : formatValue(value);
        };

        const textSignal = createSignal(untrack(getText));

        const getDigits = () => (defs.readDigits ?? TextSyncUtils.getMaskedDigits)(textSignal[0]());

        const getHasIssue = createMemo(() => {
            const digits = getDigits();

            const digitCount = defs.getDigitCount();

            if (digits.length === 0) return false;
            if (defs.getHasImpossibleDigits(digits)) return true;
            if (digitCount !== undefined && digits.length < digitCount) return getHasLeft();

            return defs.fromDigits(digits) === undefined;
        });

        const refresh = () => {
            if (untrack(defs.getValue) === undefined && untrack(getDigits).length > 0) return;

            textSignal[1](untrack(getText));
        };

        const commit = (next: T | undefined) => {
            if (defs.getIsSame(next, untrack(defs.getValue))) return;

            defs.setValue(next);
        };

        createEffect(() => {
            const digits = getDigits();
            const next = defs.fromDigits(digits);

            if (digits.length > 0 && next === undefined) return;

            commit(next);
        });

        createEffect(() => {
            const value = defs.getValue();

            if (defs.getIsSame(value, defs.fromDigits(untrack(getDigits)))) return;

            refresh();
        });

        createEffect(() => {
            const value = untrack(defs.getValue);
            const spelling = value === undefined ? "" : formatValue(value);

            if (spelling === untrack(textSignal[0])) return;

            textSignal[1](spelling);
        });

        return {
            textSignal,
            getDigits,
            getHasIssue,
            formatValue,
            commit,
            refresh,
            onInput: () => {
                setHasLeft(false);
            },
            onBlur: () => {
                setHasLeft(true);
                refresh();
            },
        };
    };
}
