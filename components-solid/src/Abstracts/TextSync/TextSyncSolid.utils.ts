import { createRenderEffect } from "solid-js";

import { type TextSyncElement, type TextSyncMaskResult, TextSyncUtils } from "@thewaver/ss-components";

/** The Solid side of {@link TextSyncUtils}: an input kept in step with a signal. The masking is framework-free. */
export namespace TextSyncSolidUtils {
    /**
     * Binds an input element to a value, preserving the caret and honoring composition.
     *
     * {@link TextSyncUtils.createValueSync} brought in step whenever the element or the value changes, before the
     * browser paints.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getRef The input or textarea.
     * @param getValue The value it should show.
     * @param opts What {@link TextSyncUtils.createValueSync} takes.
     * @returns `handleInput`, `handleCompositionStart` and `handleCompositionEnd` to attach to the
     * element's own handlers. All three are needed; composition is not optional for a field that anyone
     * might type Japanese into.
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

        createRenderEffect(() => {
            const element = getRef();

            if (!element) return;

            valueSync.sync(element);
        });

        return {
            handleInput: valueSync.handleInput,
            handleCompositionStart: valueSync.handleCompositionStart,
            handleCompositionEnd: valueSync.handleCompositionEnd,
        };
    };
}
