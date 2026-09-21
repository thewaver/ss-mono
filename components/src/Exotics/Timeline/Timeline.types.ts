import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type TimelineSpan = {
    start: number;
    end: number;
};

export type TimelineTick = {
    value: number;
    ratio: number;
    isMajor: boolean;
};

export type TimelineStepPair = {
    step: number;
    majorStep: number;
};

export type TimelinePlacement = {
    index: number;
    order: number;
    lane: number;
    startRatio: number;
    endRatio: number;
    isInView: boolean;
};

export type TimelineItemRenderProps = {
    /** Where this item sits in the list it came from. */
    index: number;
    /** Where this item has been placed on screen — how far along the axis, and in which lane. */
    placement: TimelinePlacement;
    /** The stretch of time this item covers. */
    span: TimelineSpan;
    /** Whether this item holds focus. */
    isFocused: boolean;
};

export type TimelineStop = {
    index: number;
    order: number;
    lane: number;
    span: TimelineSpan;
};

export type TimelineStep = "previous" | "next" | "laneBefore" | "laneAfter" | "first" | "last";

export type TimelineController = {
    getView: Accessor<TimelineSpan>;
    zoomBy: (factor: number, focusRatio?: number) => void;
    panBy: (ratio: number) => void;
    showSpan: (span: TimelineSpan) => void;
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
    /** Whether the timeline can be dragged sideways to move through it. */
    isPannable?: boolean;
    /** Whether the wheel and a pinch change how much of the timeline is in view. */
    isZoomable?: boolean;
    /** Turns the timeline off, so it neither pans, zooms nor picks. */
    isDisabled?: boolean;
    /** The stretch of time currently in view. It is the only thing that pans or zooms it. */
    viewSignal?: SignalSource<TimelineSpan>;
    /** Where one item sits in time. */
    computeSpan: (item: T, index: number) => TimelineSpan;
    /** Which lane one item belongs in. */
    computeLane?: (item: T, index: number) => number;
    /** Names one item for assistive technology, so a reader hears what it is rather than where it is. */
    computeItemAriaLabel?: (item: T, index: number) => string;
    /** Whether one item is turned off. */
    computeIsItemDisabled?: (item: T, index: number) => boolean;
    /** Draws one tick on the ruler. */
    renderTick?: (getTick: Accessor<TimelineTick>) => JSX.Element;
    /** Draws one item. It is handed the interaction state and where the item was placed. */
    renderItem: (getItem: Accessor<T>, getFlags: () => InteractionFlags<TimelineItemRenderProps>) => JSX.Element;
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
