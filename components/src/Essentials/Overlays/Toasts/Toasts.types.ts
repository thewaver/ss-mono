import type { CSSMargin, Size2d, SwipeDirection } from "@thewaver/ss-utils";

export type ToastsVerticalAlignment = "top" | "middle" | "bottom";

export type ToastsHorizontalAlignment = "left" | "center" | "right";

export type ToastsAlignment = `${ToastsVerticalAlignment}_${ToastsHorizontalAlignment}`;

export type ToastsFlexDirection = "column" | "column-reverse" | "row" | "row-reverse";

export type ToastsAriaLive = "polite" | "assertive";

export type ToastsOverflow = "dismiss_oldest" | "hold_newest";

export type ToastsStackAlignment = {
    justifyContent: "flex-start" | "center" | "flex-end";
    alignItems: "flex-start" | "center" | "flex-end";
};

export type BaseToast<T> = {
    /** Tells this toast from every other in the queue, so two toasts saying the same thing stay two toasts. */
    id: string;
    /** What the toast is about, for whichever painter draws it and for anything reading the queue. */
    value: T;
    /**
     * The sentence a screen reader hears when this toast arrives. The stack is not read out as it changes, so this is
     * the only thing announced; an empty sentence announces nothing and is warned about.
     */
    announcement: string;
    /** How long the toast stays before it dismisses itself. Leave it out and it waits to be dismissed. */
    durationMs?: number;
    /** How insistently this toast is announced — politely, after whatever is being read, or at once. Polite by default. */
    ariaLive?: ToastsAriaLive;
    /** Runs when the toast starts to arrive. */
    onShow?: () => void;
    /** Runs when the toast starts to leave, however it was dismissed. */
    onHide?: () => void;
};

export type ToastRequest<TToast> = Omit<TToast, "id"> & {
    /**
     * Tells this toast from every other in the queue. Leave it out and one is made up; give one to keep a toast from
     * stacking twice, since a toast whose id is already queued is refused.
     */
    id?: string;
};

export type ToastState = {
    /** Where this toast sits in the stack, counting from the oldest, which is `0`. */
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
    /**
     * Names the toast region for assistive technology, and so is what a screen reader hears when the keyboard lands
     * on the stack. Nothing can tab to a stack, so one page-wide shortcut reaches every stack: F8 moves focus into
     * each stack holding toasts in turn, in the order the providers mounted, Shift+F8 goes back, and Escape inside a
     * stack hands focus back to where it was before the first F8. The shortcut is quiet while a layer such as a
     * `Modal` sits on top.
     */
    ariaLabel: string;
    /**
     * Which corner or edge of the screen the toasts gather at. It names the screen's sides, not the text's, so a
     * stack at `"middle_left"` stays on the left of a right-to-left page. A second provider at the same alignment in the same
     * viewport draws its stack over this one, and warns once in the console when it mounts.
     */
    alignment?: ToastsAlignment;
    /**
     * Which way the stack grows, and so whether a new toast joins at the near end or the far one — CSS's own
     * `flex-direction` values. The stack keeps this layout whatever direction its toasts' text runs in.
     */
    flexDirection?: ToastsFlexDirection;
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
     * stack in the middle of the screen cannot be swiped. A committed swipe removes the toast from the queue, as
     * its timer does, and its countdown is held while the swipe is under way. The toast is not moved for you:
     * `ToastState` hands the painter the direction and the distance to draw.
     *
     * A swipe is a drag, and {@link https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html WCAG 2.5.7}
     * requires anything done by dragging to be possible with a single pointer without one. The close control the
     * painter draws is that route, so a toast that can be swiped must paint one.
     */
    isDismissableOnSwipe?: boolean;
    /** How many toasts may be on screen at once. Leave it out and they all show. */
    limit?: number;
};

export type BaseToastsProps = BaseToastsValues;
