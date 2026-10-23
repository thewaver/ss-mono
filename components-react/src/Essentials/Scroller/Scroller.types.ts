import type { ReactNode } from "react";

import type {
    BaseScrollerCbs,
    BaseScrollerProps,
    ScrollerAxis,
    ScrollerBarRefs,
    ScrollerBarRenderProps,
    ScrollerBarSide,
    ScrollerMetrics,
    ScrollerProgress,
    ScrollerStep,
    ScrollerStepper,
} from "@thewaver/ss-components";

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
     * How far the box is scrolled across and down, each from `0` to `1`, with its setter. It is the only thing that
     * scrolls it: the box writes its position through the setter as it moves, and a value written from outside
     * scrolls it there, on whichever axis changed.
     */
    progress?: readonly [ScrollerProgress, (progress: ScrollerProgress) => void];
    /**
     * Draws one scroll control. It is handed which step it is, a stepper bound to its direction for holding it
     * down to keep scrolling, and that direction: `x` for the pair stepping across, `y` for the pair stepping
     * down.
     */
    renderButton: (step: ScrollerStep, stepper: ScrollerStepper, axis: ScrollerAxis) => ReactNode;
    /**
     * Draws the bar for one scrolling direction, which the box then keeps in step with its position. Leave it out
     * and no bar is drawn; the browser's own is hidden either way. The painter is handed the bar's state and two
     * refs: the track, which the thumb's length is measured against and which takes presses, and the thumb, which
     * a press drags. Track and thumb are placed and sized however the painter likes; the thumb's thickness is the
     * painter's to keep at 24 pixels or more, as WCAG 2.5.8 asks of a target. The library draws the bar's role,
     * its value and its link to the box, and the bar takes no focus: the keyboard scrolls the box itself.
     */
    renderBar?: (renderProps: ScrollerBarRenderProps, refs: ScrollerBarRefs) => ReactNode;
    /** The content the box scrolls. It is rendered as it is, inside the box. */
    children?: ReactNode;
};
