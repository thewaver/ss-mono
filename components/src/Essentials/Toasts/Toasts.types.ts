import type { Size2d, SwipeDirection } from "@thewaver/ss-utils";

export type ToastsVerticalAlignment = "top" | "middle" | "bottom";

export type ToastsHorizontalAlignment = "left" | "center" | "right";

export type ToastsAlignment = `${ToastsVerticalAlignment}-${ToastsHorizontalAlignment}`;

export type ToastsDir = "column" | "column-reverse" | "row" | "row-reverse";

export type ToastsAriaLive = "polite" | "assertive";

export type ToastsOverflow = "dismiss-oldest" | "hold-newest";

export type ToastsStackAlignment = {
    justifyContent: "flex-start" | "center" | "flex-end";
    alignItems: "flex-start" | "center" | "flex-end";
};

export type Toast<T> = {
    id: string;
    value: T;
    durationMs?: number;
    ariaLive?: ToastsAriaLive;
    onShow?: () => void;
    onHide?: () => void;
};

export type ToastState = {
    /** Where this toast sits in the stack, counting from the newest. */
    index: number;
    /** How many toasts are on screen. */
    count: number;
    /** Whether this toast's countdown is held, by the pointer or focus being in the stack or by a swipe under way. */
    isPaused: boolean;
    /** The measured size of every toast on screen, for a painter that offsets piled toasts. */
    sizes: Size2d[];
    /**
     * Which way a swipe carries this toast off screen, or `undefined` when it cannot be swiped: swiping is
     * switched off, or the stack sits in the middle of the screen with no edge to leave by.
     */
    swipeDirection: SwipeDirection | undefined;
    /**
     * How far a swipe has carried this toast towards `swipeDirection`, from `0` to `1` of its own size. The
     * toast is not moved for you: the painter applies this as a shift, and it stays where it was left when
     * the swipe commits, so the exit plays from there.
     */
    swipeOffsetRatio: number;
    /** Whether a finger or pointer is dragging this toast, so the painter can follow it without easing. */
    isSwiping: boolean;
};
