import type { Snippet } from "svelte";

import type {
    BaseScrollerCbs,
    BaseScrollerProps,
    ScrollerAxis,
    ScrollerBarRefs,
    ScrollerBarRenderProps,
    ScrollerBarSide,
    ScrollerCbs,
    ScrollerMetrics,
    ScrollerProgress,
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
    renderBar: Snippet<[renderProps: ScrollerBarRenderProps, refs: ScrollerBarRefs]>;
};

export type ScrollerProps = BaseScrollerProps &
    ScrollerCbs & {
        /**
         * How far the box is scrolled across and down, each from `0` to `1`. It is the only thing that scrolls it: the
         * box writes its position as it moves, and a value written from outside scrolls it there, on whichever axis
         * changed. Bind it with `bind:progress` to drive or follow it; left unbound, the box keeps its own.
         */
        progress?: ScrollerProgress;
        /**
         * Draws the bar for one scrolling direction, which the box then keeps in step with its position. Leave it out
         * and no bar is drawn; the browser's own is hidden either way. The painter is handed the bar's state and two
         * refs: the track, which the thumb's length is measured against and which takes presses, and the thumb, which a
         * press drags. Track and thumb are placed and sized however the painter likes; the thumb's thickness is the
         * painter's to keep at 24 pixels or more, as
         * {@link https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html WCAG 2.5.8} asks of a target. The
         * library draws the bar's role, its value and its link to the box, and the bar takes no focus: the keyboard
         * scrolls the box itself.
         */
        renderBar?: Snippet<[renderProps: ScrollerBarRenderProps, refs: ScrollerBarRefs]>;
        /** The run of items the strip scrolls. They are rendered as they are, inside the track. */
        children?: Snippet;
    };
