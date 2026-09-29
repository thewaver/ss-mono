import { type MaybeRefOrGetter, shallowRef, toValue } from "vue";

import { type TextSyncElement, type TextSyncMaskResult, TextSyncUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** The Vue side of `TextSyncUtils`: an input kept in step with a value. The masking is framework-free. */
export namespace TextSyncVueUtils {
    /**
     * Binds an input element to a value, preserving the caret and honoring composition.
     *
     * `TextSyncUtils.createValueSync` brought in step whenever the element or the value changes, once the render
     * that changed it has been applied. The input is left uncontrolled as far as Vue is concerned — this writes its
     * `value` itself, which is what keeps the caret where it was, so the element must not also be given a `value`.
     *
     * The core puts the owner's value back into the input straight after reporting what was typed, so an owner that
     * rewrote or refused the text is what the input shows. Under Vue the owner's answer only arrives with the next
     * update, so until then the core is shown what was just typed, and the input is brought in step with the owner
     * once that update is applied — including when the owner refused the text and nothing it holds changed.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The input or textarea.
     * @param value The value it should show.
     * @param opts.onInput Called with what the user has produced — the masked text, where a mask is in use,
     * rather than the raw keystrokes.
     * @param opts.getComputeMaskedText Answers the mask to apply on every keystroke, as `TextSyncUtils.applyMask` or
     * `TextSyncUtils.applyGroupedMask` do, or `undefined` to let the text pass through unchanged. Asked at each
     * keystroke, so the mask may come and go.
     * @returns `handleInput`, `handleCompositionStart` and `handleCompositionEnd`, each taking the element, to call
     * from its own `onInput`, `onCompositionstart` and `onCompositionend`. All three are needed; composition is not
     * optional for a field that anyone might type Japanese into.
     */
    export const useValueSync = (
        ref: MaybeRefOrGetter<TextSyncElement | null | undefined>,
        value: MaybeRefOrGetter<string>,
        opts: {
            onInput: (value: string) => void;
            getComputeMaskedText?: () =>
                | ((previous: string, next: string, caret: number) => TextSyncMaskResult)
                | undefined;
        },
    ) => {
        let reported: string | undefined;

        const reportCount = shallowRef(0);

        const valueSync = TextSyncUtils.createValueSync(() => reported ?? toValue(value), {
            onInput: (next) => {
                reported = next;
                reportCount.value += 1;
                opts.onInput(next);
            },
            get computeMaskedText() {
                return opts.getComputeMaskedText?.();
            },
        });

        watchAfterRender([() => toValue(ref), () => toValue(value), reportCount], ([element]) => {
            reported = undefined;

            if (element) valueSync.sync(element);
        });

        return {
            handleInput: valueSync.handleInput,
            handleCompositionStart: valueSync.handleCompositionStart,
            handleCompositionEnd: valueSync.handleCompositionEnd,
        };
    };
}
