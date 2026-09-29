import { computed, shallowRef, watch } from "vue";

import { type MaskedFieldDefs, MaskedFieldUtils } from "@thewaver/ss-components";

/** The Vue side of `MaskedFieldUtils`: a masked field's text and value kept in step as refs. */
export namespace MaskedFieldVueUtils {
    /**
     * Wires one masked field's text and value together.
     *
     * The rules are `MaskedFieldUtils`'. Typing updates the value only when the digits make a complete, possible
     * value, so a half-finished entry leaves the last good value alone rather than clearing it. A value arriving
     * from outside rewrites the text, unless the user is mid-edit with the value already cleared. And an incomplete
     * entry is not called an error until the user leaves the field.
     *
     * The typed value is committed from the text's setter, so a keystroke and the value it makes arrive in one
     * update. The composable does not watch the format itself: a caller whose spelling can change — a locale, a
     * decimal count — calls `refresh` when it does, or writes the new spelling to `text`, and the text is rewritten
     * in the new form.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param defs The field's own rules: how to read and write the value, how to turn it into digits and back, how
     * to format digits for display, how many digits a complete entry has, which digit sequences are impossible
     * outright, and how to compare two values. The getters are read reactively.
     * @returns `text`, a writable ref the input binds to; computed refs of the `digits` currently entered and of
     * `hasIssue`, whether what is entered is wrong; `formatValue` to format a value for display, `commit` to set the
     * value directly, `refresh` to rewrite the text from the value, and `onInput` and `onBlur`, which must be called
     * from the input's own handlers for the leave-the-field rule to work.
     */
    export const useMaskedField = <T>(defs: MaskedFieldDefs<T>) => {
        const textValue = shallowRef(MaskedFieldUtils.computeText(defs.getValue(), defs));
        const hasLeft = shallowRef(false);

        const digits = computed(() => MaskedFieldUtils.readDigits(textValue.value, defs));

        const commit = (next: T | undefined) => {
            if (defs.getIsSame(next, defs.getValue())) return;

            defs.setValue(next);
        };

        const refresh = () => {
            if (defs.getValue() === undefined && digits.value.length > 0) return;

            textValue.value = MaskedFieldUtils.computeText(defs.getValue(), defs);
        };

        const text = computed({
            get: () => textValue.value,
            set: (next: string) => {
                textValue.value = next;

                const typed = MaskedFieldUtils.computeTypedValue(MaskedFieldUtils.readDigits(next, defs), defs);

                if (typed) commit(typed.value);
            },
        });

        watch(
            () => defs.getValue(),
            (value) => {
                if (defs.getIsSame(value, defs.fromDigits(digits.value))) return;

                refresh();
            },
        );

        return {
            text,
            digits,
            hasIssue: computed(() => MaskedFieldUtils.computeHasIssue(digits.value, hasLeft.value, defs)),
            formatValue: (value: T) => MaskedFieldUtils.formatValue(value, defs),
            commit,
            refresh,
            onInput: () => {
                hasLeft.value = false;
            },
            onBlur: () => {
                hasLeft.value = true;
                refresh();
            },
        };
    };
}
