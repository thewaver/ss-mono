import { createEffect, createMemo, createSignal, untrack } from "solid-js";

import { type MaskedFieldDefs, MaskedFieldUtils } from "@thewaver/ss-components";

import type { MaskedFieldHandle } from "./MaskedFieldSolid.types";

/** The Solid side of {@link MaskedFieldUtils}: a masked field's text and value kept in step by signals. */
export namespace MaskedFieldSolidUtils {
    /**
     * Wires one masked field's text and value together.
     *
     * The rules are {@link MaskedFieldUtils}'. Typing updates the value only when the digits make a complete,
     * possible value, so a half-finished entry leaves the last good value alone rather than clearing it. A value
     * arriving from outside rewrites the text, unless the user is mid-edit with the value already cleared. And an
     * incomplete entry is not called an error until the user leaves the field.
     *
     * The value is committed when the digits change and never when the rules do: a change of format rewrites the
     * text from the value, and the digits that were on screen are not read again under the new rules, which would
     * commit a value nobody typed. The rewrite follows the value as it is, so a field that started empty picks up a
     * change of format made after something was typed into it.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param defs The field's own rules: how to read the value, how to turn it into digits and back,
     * how to format digits for display, how many digits a complete entry has, which digit sequences are
     * impossible outright, and how to compare two values.
     * @returns A handle to attach to the input. `text` is what the input binds to, `getDigits`
     * is the digits currently entered, `getHasIssue` says whether what is entered is wrong,
     * `formatValue` formats a value for display, `commit` sets the value directly, `refresh` rewrites
     * the text from the value, and `onInput` and `onBlur` must be called from the input's own handlers
     * for the leave-the-field rule to work.
     */
    export const createField = <T>(defs: MaskedFieldDefs<T>): MaskedFieldHandle<T> => {
        const [getHasLeft, setHasLeft] = createSignal(false);

        const formatValue = (value: T) => MaskedFieldUtils.formatValue(value, defs);

        const getText = () => MaskedFieldUtils.computeText(defs.getValue(), defs);

        const textSignal = createSignal(untrack(getText));

        const getDigits = () => MaskedFieldUtils.readDigits(textSignal[0](), defs);

        const getHasIssue = createMemo(() => MaskedFieldUtils.computeHasIssue(getDigits(), getHasLeft(), defs));

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

            untrack(() => {
                const typed = MaskedFieldUtils.computeTypedValue(digits, defs);

                if (!typed) return;

                commit(typed.value);
            });
        });

        createEffect(() => {
            const value = defs.getValue();

            if (defs.getIsSame(value, defs.fromDigits(untrack(getDigits)))) return;

            refresh();
        });

        createEffect<{ value: T | undefined; spelling: string }>(
            (previous) => {
                const value = defs.getValue();
                const spelling = MaskedFieldUtils.computeText(value, defs);

                const isRespelled = spelling !== previous.spelling && defs.getIsSame(value, previous.value);

                if (isRespelled && spelling !== untrack(textSignal[0])) textSignal[1](spelling);

                return { value, spelling };
            },
            untrack(() => ({ value: defs.getValue(), spelling: getText() })),
        );

        return {
            text: textSignal,
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
