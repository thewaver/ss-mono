import type { Accessor, JSX } from "solid-js";

import type {
    BaseTimelineCbs,
    BaseTimelineValues,
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
} from "@thewaver/ss-components";
import type { Span, SpanTick } from "@thewaver/ss-utils";

import type { AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type TimelineController = {
    getView: Accessor<Span>;
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
    showSpan: (span: Span) => boolean;
};

export type TimelineProps<T> = AccessorValues<BaseTimelineValues<T>> &
    BaseTimelineCbs<T> & {
        /** The stretch of time currently in view. It is the only thing that pans or zooms it. */
        view?: SignalSource<Span>;
        /** Draws one tick on the ruler. */
        renderTick?: (getTick: Accessor<SpanTick>) => JSX.Element;
        /**
         * Draws one marker, as tall as the timeline, and is told where it is and whether it is in view.
         *
         * Called once per entry of `markers`, with that entry's index, so a playhead and a "now" line can be drawn
         * differently.
         */
        renderMarker?: (getMarker: Accessor<TimelineMarker>, index: number) => JSX.Element;
        /** Draws one item. It is handed the interaction state and where the item was placed. */
        renderItem: (getItem: Accessor<T>, getFlags: () => InteractionFlags<TimelineItemRenderProps>) => JSX.Element;
        /** Hands the consumer a controller once the timeline is up, for panning and zooming it from outside. */
        onMount?: (controller: TimelineController) => void;
    };

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
