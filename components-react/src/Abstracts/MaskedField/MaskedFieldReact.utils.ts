import { useEffect, useState } from "react";

import { type MaskedFieldDefs, MaskedFieldUtils } from "@thewaver/ss-components";

/** The React side of `MaskedFieldUtils`: a masked field's text and value kept in step as state. */
export namespace MaskedFieldReactUtils {
    /**
     * Wires one masked field's text and value together.
     *
     * The rules are `MaskedFieldUtils`'. Typing updates the value only when the digits make a complete, possible
     * value, so a half-finished entry leaves the last good value alone rather than clearing it. A value arriving
     * from outside rewrites the text, unless the user is mid-edit with the value already cleared. And an incomplete
     * entry is not called an error until the user leaves the field.
     *
     * Under React the typed value is committed from the text setter rather than from an effect watching the text,
     * so a keystroke and the value it makes arrive in one render. The hook does not watch the format itself: a caller
     * whose spelling can change — a locale, a decimal count — calls `refresh` when it does, or hands the new spelling
     * to `textState`'s setter, and the text is rewritten in the new form.
     *
     * @param defs The field's own rules, with this render's `value` and `digitCount` in place of the getters:
     * how to write the value, how to turn it into digits and back, how to format digits for display, which digit
     * sequences are impossible outright, and how to compare two values.
     * @returns `textState`, which the input binds to, `digits` currently entered, `hasIssue` for whether what is
     * entered is wrong, `formatValue` to format a value for display, `commit` to set the value directly, `refresh`
     * to rewrite the text from the value, and `onInput` and `onBlur`, which must be called from the input's own
     * handlers for the leave-the-field rule to work.
     */
    export const useMaskedField = <T>(
        defs: Omit<MaskedFieldDefs<T>, "getValue" | "getDigitCount"> & {
            value: T | undefined;
            digitCount: number | undefined;
        },
    ) => {
        const ruleDefs = { ...defs, getDigitCount: () => defs.digitCount };

        const [text, setText] = useState(() => MaskedFieldUtils.computeText(defs.value, defs));
        const [hasLeft, setHasLeft] = useState(false);

        const digits = MaskedFieldUtils.readDigits(text, defs);

        const commit = (next: T | undefined) => {
            if (defs.getIsSame(next, defs.value)) return;

            defs.setValue(next);
        };

        const refresh = () => {
            if (defs.value === undefined && digits.length > 0) return;

            setText(MaskedFieldUtils.computeText(defs.value, defs));
        };

        const type = (next: string) => {
            setText(next);

            const typed = MaskedFieldUtils.computeTypedValue(MaskedFieldUtils.readDigits(next, defs), defs);

            if (typed) commit(typed.value);
        };

        useEffect(() => {
            if (defs.getIsSame(defs.value, defs.fromDigits(digits))) return;

            refresh();
        }, [defs.value]);

        return {
            textState: [text, type] as const,
            digits,
            hasIssue: MaskedFieldUtils.computeHasIssue(digits, hasLeft, ruleDefs),
            formatValue: (value: T) => MaskedFieldUtils.formatValue(value, defs),
            commit,
            refresh,
            onInput: () => setHasLeft(false),
            onBlur: () => {
                setHasLeft(true);
                refresh();
            },
        };
    };
}
