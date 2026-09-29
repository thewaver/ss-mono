import { untrack } from "svelte";

import { type TextSyncElement, type TextSyncMaskResult, TextSyncUtils } from "@thewaver/ss-components";

/** The Svelte side of {@link TextSyncUtils}: an input kept in step with a value. The masking is framework-free. */
export namespace TextSyncSvelteUtils {
    /**
     * Binds an input element to a value, preserving the caret and honoring composition.
     *
     * {@link TextSyncUtils.createValueSync} brought in step whenever the element or the value changes, before the
     * browser paints. The element's `value` is written by this and nothing else — give the element no `value`
     * attribute and no `bind:value` — which is what keeps the caret where it was. The core writes the owner's value
     * back straight after reporting what was typed, so an owner that rewrote or refused the text is what the input
     * shows.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The input or textarea.
     * @param getValue The value it should show.
     * @param opts What {@link TextSyncUtils.createValueSync} takes. Read when it is needed, so a getter here follows
     * the component's props.
     * @returns `handleInput`, `handleCompositionStart` and `handleCompositionEnd` to call from the element's own
     * `oninput`, `oncompositionstart` and `oncompositionend`. All three are needed; composition is not optional for a
     * field that anyone might type Japanese into.
     */
    export const createValueSync = (
        getRef: () => TextSyncElement | undefined,
        getValue: () => string,
        opts: {
            onInput: (value: string) => void;
            computeMaskedText?: (previous: string, next: string, caret: number) => TextSyncMaskResult;
        },
    ) => {
        const valueSync = TextSyncUtils.createValueSync(getValue, opts);

        $effect.pre(() => {
            const element = getRef();

            getValue();

            if (!element) return;

            untrack(() => valueSync.sync(element));
        });

        return {
            handleInput: valueSync.handleInput,
            handleCompositionStart: valueSync.handleCompositionStart,
            handleCompositionEnd: valueSync.handleCompositionEnd,
        };
    };
}
