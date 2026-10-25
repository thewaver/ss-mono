import type { ReactNode } from "react";

import type {
    BaseScrollerCbs,
    BaseScrollerProps,
    ScrollerAxis,
    ScrollerBarRefs,
    ScrollerBarRenderProps,
    ScrollerBarSide,
    ScrollerController as ScrollerCoreController,
    ScrollerMetrics,
    ScrollerProgress,
} from "@thewaver/ss-components";

export type ScrollerController = ScrollerCoreController & {
    /**
     * Calls `listener` whenever anything the steppers or `getBoxId` report has changed, until the returned function is
     * called. They answer with what the scroller last drew, so this and one getter are what `useSyncExternalStore`
     * takes — which is how a consumer's own button disables itself once the box reaches that end.
     */
    subscribe: (listener: () => void) => () => void;
};

export type ScrollerBarProps = BaseScrollerCbs & {
    /** Which way the bar runs. */
    axis: ScrollerAxis;
    /** The id of the box the bar scrolls, for its `aria-controls`. */
    boxId: string;
    /** The scrolling box. */
    boxRef: HTMLElement | undefined;
    /** The scroller's outermost element, which swallows the click a drag ends with. */
    rootRef: HTMLElement | undefined;
    /** The reading of the axis the bar runs along. */
    metrics: ScrollerMetrics;
    /** Whether the bar floats over the box's edge rather than keeping a strip of its own. */
    isOverlaid: boolean;
    /** Which side of the box the bar sits on. */
    side: ScrollerBarSide;
    /** Whether the bar fades while nothing is happening. */
    isAutoHiding: boolean;
    /** Whether the box is scrolling, or stopped less than the hide delay ago. */
    isScrolling: boolean;
    /** Whether the pointer is over the scroller. */
    isHovered: boolean;
    /** How many items of the view just left a page of the track keeps in view. */
    overlapCount: number;
    /** Draws the bar. */
    renderBar: (renderProps: ScrollerBarRenderProps, refs: ScrollerBarRefs) => ReactNode;
};

export type ScrollerProps = BaseScrollerProps & {
    /**
     * Hands over the controller once the scroller is in the page: one stepper per direction, saying whether the box
     * is at either end and stepping it about a view either way, plus the box's id and a way to hear when any of
     * that changes.
     *
     * **The scroller draws no buttons, so any are built on this, wherever the page wants them.** Point each at
     * {@link ScrollerController.getBoxId} with `aria-controls`, name it by the way it scrolls, and disable it while
     * its stepper says the box is already at that end, following it through {@link ScrollerController.subscribe}.
     * Wheel, touch and the box's own keyboard scrolling stay the browser's whether or not buttons are built.
     */
    onMount?: (controller: ScrollerController) => void;
    /**
     * How far the box is scrolled across and down, each from `0` to `1`, with its setter. It is the only thing that
     * scrolls it: the box writes its position through the setter as it moves, and a value written from outside
     * scrolls it there, on whichever axis changed.
     */
    progress?: readonly [ScrollerProgress, (progress: ScrollerProgress) => void];
    /**
     * Draws the bar for one scrolling direction, which the box then keeps in step with its position. Leave it out and
     * no bar is drawn; the browser's own is hidden either way. The painter is handed the bar's state and two refs: the
     * track, which the thumb's length is measured against and which takes presses, and the thumb, which a press drags.
     * Track and thumb are placed and sized however the painter likes; the thumb's thickness is the painter's to keep at
     * 24 pixels or more, as {@link https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html WCAG 2.5.8}
     * asks of a target. The library draws the bar's role, its value and its link to the box, and the bar takes no
     * focus: the keyboard scrolls the box itself.
     */
    renderBar?: (renderProps: ScrollerBarRenderProps, refs: ScrollerBarRefs) => ReactNode;
    /** The content the box scrolls. It is rendered as it is, inside the box. */
    children?: ReactNode;
};
