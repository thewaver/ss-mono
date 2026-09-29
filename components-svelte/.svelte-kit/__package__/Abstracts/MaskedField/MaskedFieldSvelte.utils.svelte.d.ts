import { type MaskedFieldDefs } from "@thewaver/ss-components";
import type { MaskedFieldHandle } from "./MaskedFieldSvelte.types.js";
/** The Svelte side of {@link MaskedFieldUtils}: a masked field's text and value kept in step by runes. */
export declare namespace MaskedFieldSvelteUtils {
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
    const createField: <T>(defs: MaskedFieldDefs<T>) => MaskedFieldHandle<T>;
}
