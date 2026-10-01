import type { Accessor, JSX } from "solid-js";

import type {
    InteractionFlags,
    TimelineEdgeAnnouncements,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineSpan,
    TimelineTick,
} from "@thewaver/ss-components";

import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type TimelineController = {
    getView: Accessor<TimelineSpan>;
    /**
     * Zooms the view in or out about a point.
     *
     * @param factor How much to scale the visible extent by; below `1` zooms in.
     * @param focusRatio Where across the view to keep fixed, `0`–`1`. The middle by default.
     * @returns `false` when the view was already at the limit and clamping left it unmoved.
     */
    zoomBy: (factor: number, focusRatio?: number) => boolean;
    /**
     * Slides the view along without changing how much it shows.
     *
     * @param ratio How far to travel, as a fraction of the visible extent.
     * @returns `false` when the view was already against the end of the range.
     */
    panBy: (ratio: number) => boolean;
    /**
     * Moves and widens the view as little as needed to bring a span into it.
     *
     * @param span The span that must end up visible.
     * @returns `false` when it was already fully in view.
     */
    showSpan: (span: TimelineSpan) => boolean;
};

export type TimelineProps<T> = AccessorProps<{
    /** The whole stretch of time the timeline covers, which is as far as it can ever be panned or zoomed out to. */
    range: TimelineSpan;
    /** The items to place, each asked separately where it sits and which lane it belongs in. */
    items: T[];
    /** How thick one lane is, across the axis. */
    laneSize: number;
    /** The space between one lane and the next. */
    laneGap?: number;
    /** How much room the ruler takes. */
    axisSize?: number;
    /** How many lanes there are. */
    laneCount?: number;
    /**
     * The shortest stretch of time the view may be zoomed in to, which is what stops the reader zooming past all
     * meaning.
     */
    minViewExtent?: number;
    /**
     * The step sizes the ruler is allowed to use, in the order it should prefer them, so the ticks land on round
     * numbers rather than wherever they fall.
     */
    tickSteps?: number[];
    /** The closest two ticks may be drawn before a coarser step is chosen instead. */
    minTickGap?: number;
    /** Names the timeline for assistive technology. */
    ariaLabel?: string;
    /**
     * Points in time to mark across every lane — a playhead, the present moment, a deadline — each drawn by
     * `renderMarker`. Pass an accessor that changes and the marks move with it.
     */
    markers?: number[];
    /**
     * How wide the strip at each end of an item is that takes hold of that edge rather than panning, centered on
     * the edge. Only there when `onSpanChange` is given.
     */
    edgeGrabSize?: number;
    /**
     * Everything said aloud while an edge is held from the keyboard, and the key hints and place names those
     * announcements are built from. Without it the keyboard route to the edges still works but says nothing.
     */
    edgeAnnouncements?: TimelineEdgeAnnouncements;
    /** Whether the timeline can be dragged sideways to move through it. */
    isPannable?: boolean;
    /** Whether the wheel and a pinch change how much of the timeline is in view. */
    isZoomable?: boolean;
    /** Turns the timeline off, so it neither pans, zooms nor picks. */
    isDisabled?: boolean;
    /** The stretch of time currently in view. It is the only thing that pans or zooms it. */
    view?: SignalSource<TimelineSpan>;
    /** Where one item sits in time. */
    computeSpan: (item: T, index: number) => TimelineSpan;
    /**
     * Rounds a value an edge is being moved to, so edges land on whole minutes, frames or whatever the scale counts
     * in. With it, an arrow key moves a held edge to the next snapped value in its direction; without it, by one
     * tick of the ruler.
     */
    computeSnapValue?: (value: number) => number;
    /** Which lane one item belongs in. */
    computeLane?: (item: T, index: number) => number;
    /** Names one item for assistive technology, so a reader hears what it is rather than where it is. */
    computeItemAriaLabel?: (item: T, index: number) => string;
    /** Whether one item is turned off. */
    computeIsItemDisabled?: (item: T, index: number) => boolean;
    /** Draws one tick on the ruler. */
    renderTick?: (getTick: Accessor<TimelineTick>) => JSX.Element;
    /**
     * Draws one marker, as tall as the timeline, and is told where it is and whether it is in view.
     *
     * Called once per entry of `markers`, with that entry's index, so a playhead and a "now" line can be drawn
     * differently.
     */
    renderMarker?: (getMarker: Accessor<TimelineMarker>, index: number) => JSX.Element;
    /** Draws one item. It is handed the interaction state and where the item was placed. */
    renderItem: (getItem: Accessor<T>, getFlags: () => InteractionFlags<TimelineItemRenderProps>) => JSX.Element;
    /**
     * Runs when one edge of an item has been moved and dropped, with the span the item should now have. Giving it
     * is what switches the edges on.
     *
     * A pointer takes hold of an edge by dragging the strip at it, or by pressing that strip and then pressing
     * where the edge should go. From the keyboard, `Enter` on a focused item takes hold of its end, `Home` and
     * `End` switch between its start and its end, the left and right arrows move the held edge, `Enter` or
     * `Space` drops it and `Escape` puts it back. While edges are on, `Enter` takes hold instead of activating,
     * and `Space` still activates. The timeline never moves the item itself: the new span is the consumer's to
     * store.
     */
    onSpanChange?: (item: T, index: number, span: TimelineSpan) => void;
    /** Runs when an item is activated, by pointer or by key. */
    onItemActivate?: (item: T, index: number) => void;
    /** Hands the consumer a controller once the timeline is up, for panning and zooming it from outside. */
    onMount?: (controller: TimelineController) => void;
}>;

export type TimelineItemProps = {
    /** Identifies this item, so the timeline can point focus at it. */
    id: string;
    /** Names this item for assistive technology. */
    ariaLabel?: string;
    /** Points at the element holding the key hint, while the item's edges can be taken hold of. */
    ariaDescribedBy?: string;

    /** This item's interaction state, handed down so the painted part can answer to it. */
    flags: InteractionFlags<TimelineItemRenderProps>;
    /** Receives the item element once it exists, so the timeline can measure and scroll it. */
    ref: (element: HTMLElement) => void;
    /** Draws the item body. */
    renderContent: (getFlags: () => InteractionFlags<TimelineItemRenderProps>) => JSX.Element;
    /** Runs when this item is activated. */
    onActivate: () => void;
    /** Runs when this item takes focus, which is what scrolls it into view. */
    onFocused: () => void;
};
