import { type RefObject, useLayoutEffect, useRef, useState } from "react";

import { type TextSyncElement, type TextSyncMaskResult, TextSyncUtils } from "@thewaver/ss-components";

import { useElement, useLatest } from "../../Utils/refUtils";

/** The React side of `TextSyncUtils`: an input kept in step with a value. The masking is framework-free. */
export namespace TextSyncReactUtils {
    /**
     * Binds an input element to a value, preserving the caret and honoring composition.
     *
     * `TextSyncUtils.createValueSync` brought in step whenever the element or the value changes, before the
     * browser paints. The input is left uncontrolled as far as React is concerned — this writes its `value` itself,
     * which is what keeps the caret where it was.
     *
     * The core puts the owner's value back into the input straight after reporting what was typed, so an owner that
     * rewrote or refused the text is what the input shows. Under React the owner's answer only arrives with the next
     * render, so until then the core is shown what was just typed, and the input is brought in step with the owner
     * once that render is applied — including when the owner refused the text and nothing it holds changed. Reading
     * the previous value there instead would write the old text back mid-keystroke and drop the caret.
     *
     * @param ref The input or textarea.
     * @param value The value it should show.
     * @param opts.onInput Called with what the user has produced — the masked text, where a mask is in use,
     * rather than the raw keystrokes.
     * @param opts.computeMaskedText Applies a mask on every keystroke, as `TextSyncUtils.applyMask` or
     * `TextSyncUtils.applyGroupedMask` do. Without one the text passes through unchanged.
     * @returns `handleInput`, `handleCompositionStart` and `handleCompositionEnd`, each taking the element, to call
     * from its own `onInput`, `onCompositionStart` and `onCompositionEnd`. All three are needed; composition is not
     * optional for a field that anyone might type Japanese into.
     */
    export const useValueSync = (
        ref: RefObject<TextSyncElement | null>,
        value: string,
        opts: {
            onInput: (value: string) => void;
            computeMaskedText?: (previous: string, next: string, caret: number) => TextSyncMaskResult;
        },
    ) => {
        const latest = useLatest({ value, ...opts });
        const element = useElement(ref);
        const reportedRef = useRef<string | undefined>(undefined);
        const [reportCount, setReportCount] = useState(0);

        const [valueSync] = useState(() =>
            TextSyncUtils.createValueSync(() => reportedRef.current ?? latest.current.value, {
                onInput: (next) => {
                    reportedRef.current = next;
                    setReportCount((count) => count + 1);
                    latest.current.onInput(next);
                },
                get computeMaskedText() {
                    return latest.current.computeMaskedText;
                },
            }),
        );

        useLayoutEffect(() => {
            reportedRef.current = undefined;

            if (element) valueSync.sync(element);
        }, [element, value, valueSync, reportCount]);

        return {
            handleInput: valueSync.handleInput,
            handleCompositionStart: valueSync.handleCompositionStart,
            handleCompositionEnd: valueSync.handleCompositionEnd,
        };
    };
}
