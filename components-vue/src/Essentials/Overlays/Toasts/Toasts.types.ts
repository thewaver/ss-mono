import type { VNodeChild } from "vue";

import type { BaseToastsProps, Toast, ToastState } from "@thewaver/ss-components";
import type { Size2d, SwipeDirection } from "@thewaver/ss-utils";

export type ToastRenderer<T> = (props: {
    toast: Toast<T>;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    state: ToastState;
}) => VNodeChild;

export type ToastsItemProps<T> = {
    /** The toast this item stands for. */
    toast: Toast<T>;
    /** Where this toast sits in the stack, counting from the newest. */
    index: number;
    /** How many toasts are on screen, so a piled toast can tell how deep it is buried. */
    count: number;
    /** Whether this toast is on its way out, so it can paint its exit rather than its arrival. */
    isExiting: boolean;
    /**
     * Whether this toast's countdown is held, which happens while the pointer is over the stack so a toast cannot
     * expire under the reader.
     */
    isPaused: boolean;
    /** How long this toast takes to arrive and to leave. */
    transitionDurationMs: number;
    /**
     * The measured size of every toast on screen, which is what lets a piled toast work out how far to offset
     * itself.
     */
    sizes: Size2d[];
    /** Which way a swipe dismisses this toast, or `undefined` when a swipe does nothing. */
    swipeDirection: SwipeDirection | undefined;
    /** Runs when this toast's time is up. */
    onElapse: () => void;
    /** Runs when a swipe carries this toast far enough to dismiss it. */
    onSwipeDismiss: () => void;
    /** Runs once this toast has finished leaving and can be taken out of the list. */
    onExitEnd: () => void;
};

export type ToastsProps<T> = BaseToastsProps<T> & {
    /** The toasts on screen. It is the only thing that adds or removes one. */
    "toasts": Toast<T>[];
    /**
     * Receives the toasts left once one has timed out, been swiped away or been trimmed past the limit, which is what
     * `v-model:toasts` binds.
     */
    "onUpdate:toasts"?: (toasts: Toast<T>[]) => void;
};

export type ToastsSlots<T> = {
    /** Draws one toast. */
    renderToast: ToastRenderer<T>;
};
