import type { Point2d } from "@thewaver/ss-utils";

export type ScrollerStep = "previous" | "next";

export type ScrollerButtonPlacement = "split" | "start" | "end";

export type ScrollerAxis = "x" | "y";

export type ScrollerOverflow = "auto" | "scroll" | "hidden";

export type ScrollerBarSide = "start" | "end";

export type ScrollerProgress = {
    /** How far along the box is scrolled across the page, from `0` at the inline start to `1` at the end. */
    x: number;
    /** How far down the box is scrolled, from `0` at the top to `1` at the bottom. */
    y: number;
};

export type ScrollerStepper = {
    /** Whether the run is scrolled all the way to its start. */
    getIsAtStart: () => boolean;
    /** Whether the run is scrolled all the way to its end. */
    getIsAtEnd: () => boolean;
    /** Scrolls back by about one view. Answers `false` when the run is already at its start. */
    stepToPrevious: () => boolean;
    /** Scrolls on by about one view. Answers `false` when the run is already at its end. */
    stepToNext: () => boolean;
};

export type ScrollerMetrics = {
    start: number;
    visible: number;
    total: number;
};

export type ScrollerBoxMetrics = Record<ScrollerAxis, ScrollerMetrics>;

export type ScrollerAxisSteps = { leading: ScrollerStep[]; trailing: ScrollerStep[] };

export type ScrollerBoxSteps = Record<ScrollerAxis, ScrollerAxisSteps>;

export type ScrollerGridTemplate = { areas: string; columns: string; rows: string };

export type ScrollerBarRenderProps = {
    /** Which way the bar runs: `x` across the page, `y` down it. */
    axis: ScrollerAxis;
    /** How far along this direction the box is scrolled, from `0` to `1`. */
    ratio: number;
    /**
     * How long the thumb is, in pixels: the share of the content in view, applied to the measured track, and never
     * shorter than 24 pixels or longer than the track. Its thickness is the painter's, and so is meeting the 24-pixel
     * target size across the bar.
     */
    thumbLength: number;
    /**
     * How far the thumb sits from the track's start, in pixels: from the inline start across the page, so a
     * right-to-left page counts from the right, and from the top down it.
     */
    thumbOffset: number;
    /** Whether a drag of this bar's thumb is under way. */
    isDragging: boolean;
    /** Whether the box is scrolling, or stopped less than `hideDelayMs` ago. Always `false` unless `isAutoHiding`. */
    isScrolling: boolean;
    /** Whether the pointer is over the scroller, counted from its real movement. Always `false` unless `isAutoHiding`. */
    isHovered: boolean;
    /** Whether the bar should be showing: always without `isAutoHiding`, and otherwise while scrolling, hovered or dragged. */
    isShown: boolean;
};

export type ScrollerBarRefs = {
    /** Hands the library the track: what it measures the thumb against, and what takes presses. */
    setTrackRef: (element: HTMLElement | undefined) => void;
    /** Hands the library the thumb, the part a press drags rather than pages. */
    setThumbRef: (element: HTMLElement | undefined) => void;
};

export type ScrollerBarDefs = {
    axis: ScrollerAxis;
    getBox: () => HTMLElement | undefined;
    getTrack: () => HTMLElement | undefined;
    getThumb: () => HTMLElement | undefined;
    getOverlapCount: () => number;
    getComputeProgressAtPoint: () => BaseScrollerCbs["computeProgressAtPoint"];
    onDraggingChange: (isDragging: boolean) => void;
};

export type ScrollerActivityDefs = {
    getHideDelayMs: () => number;
    onScrollingChange: (isScrolling: boolean) => void;
    onHoveredChange: (isHovered: boolean) => void;
};

export type BaseScrollerValues = {
    /**
     * The id of the scrolling box, which each drawn bar names in its `aria-controls`. Leave it out and one is
     * generated.
     */
    id?: string;
    /** The space between items. */
    gap?: number;
    /** How much room is left at the ends of the run, so the first and last items are not flush against the edge. */
    padding?: number;
    /**
     * How many of the items fully in view stay in view after a step, so a reader keeps something to tie the new view
     * to. The default is none: a step moves on by as much as fits, and only the item cut off at the edge is carried
     * over. A whole number from `0`; a fraction is rounded down, and a step always moves by at least one item,
     * however large this is, so it can never leave a press doing nothing.
     */
    overlapCount?: number;
    /** Where the scroll controls sit. Each scrolling direction has its own pair, placed the same way. */
    buttonPlacement?: ScrollerButtonPlacement;
    /**
     * Whether the box scrolls across the page, written to its `overflow-x`: `auto` scrolls and shows the bar only while
     * the content overflows, `scroll` always shows the bar, and `hidden` neither scrolls nor shows it.
     */
    overflowX?: ScrollerOverflow;
    /**
     * Whether the box scrolls down the page, written to its `overflow-y`, with the values `overflowX` takes. A box
     * scrolling only this way lays its children out in a column; one scrolling both ways keeps them in a row.
     */
    overflowY?: ScrollerOverflow;
    /**
     * Which side of the box the across bar sits on: `end` puts it below the content, `start` above it. Overlaid, the
     * bar floats over that edge of the content instead.
     */
    barSideX?: ScrollerBarSide;
    /**
     * Which side of the box the down bar sits on: `end` puts it after the content in reading order — the right, or the
     * left on a right-to-left page — and `start` before it.
     */
    barSideY?: ScrollerBarSide;
    /**
     * Whether a drawn bar fades while nothing is happening. The painter is told when the box is scrolling and when
     * the pointer is over it, and whether to show; a faded bar stays in the page, so nothing moves when it returns.
     */
    isAutoHiding?: boolean;
    /** How long a bar stays shown after scrolling stops, in milliseconds, when `isAutoHiding` is on. */
    hideDelayMs?: number;
    /**
     * Whether a drawn bar floats over the content's edge rather than keeping a strip of its own beside it. In their
     * own strips, the vertical bar sits on the inline end — the left on a right-to-left page — and the horizontal
     * one along the bottom, with the corner where they meet left empty.
     */
    isBarOverlaid?: boolean;
};

export type BaseScrollerCbs = {
    /**
     * Where along a bar a pointer sits, as progress from `0` to `1`, for a bar whose track is not a straight line —
     * an arc, say. Given this, a dragged thumb follows the pointer through it rather than sliding along the track's
     * length, and a press on the track pages towards, or with Alt (Option on a Mac) jumps to, what it answers. The
     * answer is held inside `0` to `1`.
     *
     * It is handed which bar, the pointer and the track's box, both in the page's client coordinates as a pointer
     * event and `getBoundingClientRect` report them. `RangeUtils.computeAngularValue` with a `min` of `0` and a `max`
     * of `1` is the formula for an arc.
     */
    computeProgressAtPoint?: (axis: ScrollerAxis, point: Point2d, rect: DOMRect) => number;
};

export type BaseScrollerProps = BaseScrollerValues & BaseScrollerCbs;
