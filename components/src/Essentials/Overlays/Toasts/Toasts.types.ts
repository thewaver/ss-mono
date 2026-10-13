import type { CSSMargin, Size2d, SwipeDirection } from "@thewaver/ss-utils";

export type ToastsVerticalAlignment = "top" | "middle" | "bottom";

export type ToastsHorizontalAlignment = "left" | "center" | "right";

export type ToastsAlignment = `${ToastsVerticalAlignment}_${ToastsHorizontalAlignment}`;

export type ToastsDir = "column" | "column-reverse" | "row" | "row-reverse";

export type ToastsAriaLive = "polite" | "assertive";

export type ToastsOverflow = "dismiss_oldest" | "hold_newest";

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

export type BaseToastsValues = {
    /** Names the toast region for assistive technology. */
    ariaLabel: string;
    /** How insistently new toasts are announced — politely, after whatever is being read, or immediately. */
    ariaLive?: ToastsAriaLive;
    /** A key that moves focus into the toast region, so a reader can reach a toast without hunting for it. */
    hotkey?: string;
    /** Which corner or edge of the screen the toasts gather at. */
    alignment?: ToastsAlignment;
    /** Which way the stack grows, and so whether a new toast joins at the near end or the far one. */
    dir?: ToastsDir;
    /** The space between one toast and the next. */
    gap?: number;
    /** How far the stack is held off the edges of the screen. */
    margins?: CSSMargin;
    /** What happens once the limit is reached: the oldest toast is dismissed, or the newest waits its turn. */
    overflow?: ToastsOverflow;
    /** How long a toast takes to arrive, to leave, and to slide when the stack shifts. */
    transitionDurationMs?: number;
    /**
     * Whether a toast can be swiped off screen. Defaults to `true`. The swipe runs towards the edge the stack sits on
     * — sideways for a stack against the left or right, up or down for one centered along the top or bottom — and a
     * stack in the middle of the screen cannot be swiped. A committed swipe removes the toast from `toasts`, as
     * its timer does, and its countdown is held while the swipe is under way. The toast is not moved for you:
     * `ToastState` hands the painter the direction and the distance to draw.
     *
     * A swipe is a drag, and WCAG 2.5.7 requires anything done by dragging to be possible with a single pointer
     * without one. The close control the painter draws is that route, so a toast that can be swiped must paint one.
     */
    isDismissableOnSwipe?: boolean;
    /** How many toasts may be on screen at once. Leave it out and they all show. */
    limit?: number;
};

export type BaseToastsCbs<T> = {
    /**
     * Builds the sentence a toast is announced with, for a toast whose visible text does not read well out of context.
     */
    computeAnnouncement?: (toast: Toast<T>) => string;
};

export type BaseToastsProps<T> = BaseToastsValues & BaseToastsCbs<T>;
