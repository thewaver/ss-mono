import { untrack } from "svelte";
import { MaskedFieldUtils } from "@thewaver/ss-components";
/** The Svelte side of {@link MaskedFieldUtils}: a masked field's text and value kept in step by runes. */
export var MaskedFieldSvelteUtils;
(function (MaskedFieldSvelteUtils) {
    /**
     * Wires one masked field's text and value together.
     *
     * The rules are {@link MaskedFieldUtils}'. Typing updates the value only when the digits make a complete,
     * possible value, so a half-finished entry leaves the last good value alone rather than clearing it. A value
     * arriving from outside rewrites the text, unless the user is mid-edit with the value already cleared. A change
     * of spelling — a locale, a decimal count, a date order — rewrites the text in the new form, as if the user had
     * typed it. And an incomplete entry is not called an error until the user leaves the field.
     *
     * The value is committed from `text`'s setter, as React's hook does, never from watching the text: a change of
     * rules would otherwise read the old text under the new ones and commit a value nobody typed. The rewrite on a
     * change of spelling follows the value as it is, so a field that started empty picks up a change made after
     * something was typed into it.
     *
     * Must run while a component is being set up.
     *
     * @param defs The field's own rules: how to read the value, how to turn it into digits and back, how to format
     * digits for display, how many digits a complete entry has, which digit sequences are impossible outright, and
     * how to compare two values. The getters are read reactively, so they may read the component's props.
     * @returns A handle to attach to the input. `text` is what the input shows, and writing it is typing;
     * `getDigits` is the digits currently entered, `getHasIssue` says whether what is entered is wrong,
     * `formatValue` formats a value for display, `commit` sets the value directly, `refresh` rewrites the text from
     * the value, and `onInput` and `onBlur` must be called from the input's own handlers for the leave-the-field rule
     * to work.
     */
    MaskedFieldSvelteUtils.createField = (defs) => {
        let hasLeft = $state(false);
        const formatValue = (value) => MaskedFieldUtils.formatValue(value, defs);
        const getText = () => MaskedFieldUtils.computeText(defs.getValue(), defs);
        let text = $state(untrack(getText));
        const digits = $derived(MaskedFieldUtils.readDigits(text, defs));
        const hasIssue = $derived(MaskedFieldUtils.computeHasIssue(digits, hasLeft, defs));
        const refresh = () => {
            untrack(() => {
                if (defs.getValue() === undefined && digits.length > 0)
                    return;
                text = getText();
            });
        };
        const commit = (next) => {
            if (defs.getIsSame(next, untrack(defs.getValue)))
                return;
            defs.setValue(next);
        };
        const type = (next) => {
            untrack(() => {
                text = next;
                const typed = MaskedFieldUtils.computeTypedValue(MaskedFieldUtils.readDigits(next, defs), defs);
                if (typed)
                    commit(typed.value);
            });
        };
        $effect(() => {
            const value = defs.getValue();
            untrack(() => {
                if (defs.getIsSame(value, defs.fromDigits(digits)))
                    return;
                refresh();
            });
        });
        let spelled = untrack(() => ({ value: defs.getValue(), spelling: getText() }));
        $effect.pre(() => {
            const value = defs.getValue();
            const spelling = MaskedFieldUtils.computeText(value, defs);
            untrack(() => {
                const previous = spelled;
                spelled = { value, spelling };
                const isRespelled = spelling !== previous.spelling && defs.getIsSame(value, previous.value);
                if (!isRespelled || spelling === text)
                    return;
                type(spelling);
            });
        });
        return {
            text: [() => text, type],
            getDigits: () => digits,
            getHasIssue: () => hasIssue,
            formatValue,
            commit,
            refresh,
            onInput: () => {
                hasLeft = false;
            },
            onBlur: () => {
                hasLeft = true;
                refresh();
            },
        };
    };
})(MaskedFieldSvelteUtils || (MaskedFieldSvelteUtils = {}));
