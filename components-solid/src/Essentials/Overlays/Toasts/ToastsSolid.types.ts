import type { Accessor, JSX } from "solid-js";

import type { BaseToast, BaseToastsValues, NavigatorDirection, ToastState } from "@thewaver/ss-components";
import type { Size2d, SwipeDirection } from "@thewaver/ss-utils";

import type { AccessorProps, AccessorValues, MaybeAccessor, SignalSource } from "../../../Utils/typeUtils";

export type ToastRenderer<T> = (
    getToast: Accessor<Toast<T>>,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getState: () => ToastState,
) => JSX.Element;

export type DefaultToastRenderer<T> = (
    getToast: Accessor<Toast<T>>,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getState: () => ToastState,
    dismiss: () => boolean,
) => JSX.Element;

export type Toast<T> = BaseToast<T> & {
    /**
     * Draws this toast, in place of the provider's `renderToast`. It is read once, when the toast mounts: replacing
     * the toast in the queue under the same `id` changes what `getToast` answers, not which painter draws it. It closes
     * its toast through the `dismiss` it was raised with.
     */
    renderToast?: ToastRenderer<T>;
};

export type ToastsItemProps<T> = AccessorProps<{
    /** Where this toast sits in the stack, counting from the oldest. */
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
     * The measured size of every toast on screen, which is what lets a piled toast work out how far to offset itself.
     */
    sizes: Size2d[];
    /** Which way a swipe dismisses this toast, or `undefined` when a swipe does nothing. */
    swipeDirection: SwipeDirection | undefined;
    /** Which way this toast's text runs: that of whatever raised it. */
    direction: NavigatorDirection;
    /** Receives the toast element once it exists, so the stack can measure it. */
    ref: (element: HTMLElement) => void;
    /** Runs when this toast's time is up. */
    onElapse: () => void;
    /** Runs when a swipe carries this toast far enough to dismiss it. */
    onSwipeDismiss: () => void;
    /** Runs once this toast has finished leaving and can be taken out of the list. */
    onExitEnd: () => void;
}> & {
    /** The toast this item stands for. */
    toast: MaybeAccessor<Toast<T>>;
    /** Draws the toast body: the toast's own painter, or the provider's. */
    renderToast: ToastRenderer<T> | undefined;
};

export type ToastsProps<T> = AccessorValues<BaseToastsValues> & {
    /**
     * The queue, oldest first, when the consumer wants to hold it — to raise toasts from code outside any component,
     * or to read what is queued. Left out, the provider keeps its own, and toasts are raised through
     * `useToastsContext`. Either way the provider writes to it: it removes a toast whose time is up, one swiped away,
     * and those past the limit under `"dismiss_oldest"`.
     */
    toasts?: SignalSource<Toast<T>[]>;
    /**
     * Draws every toast that brings no painter of its own. It is handed a `dismiss` for the toast it draws, since it
     * has no raiser's to borrow.
     */
    renderToast?: DefaultToastRenderer<T>;
};
