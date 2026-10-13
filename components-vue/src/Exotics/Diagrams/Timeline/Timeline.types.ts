import type { VNodeChild } from "vue";

import type {
    BaseTimelineProps,
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineSpan,
    TimelineTick,
} from "@thewaver/ss-components";

export type TimelineController = {
    /** The stretch of time in view, as the timeline last drew it. */
    getView: () => TimelineSpan;
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

export type TimelineProps<T> = BaseTimelineProps<T> & {
    /**
     * The stretch of time currently in view. It is the only thing that pans or zooms it. Leave it out and the
     * timeline keeps its own, starting on the whole range.
     */
    "view"?: TimelineSpan;
    /** Receives the view as the timeline is panned or zoomed, which is what `v-model:view` binds. */
    "onUpdate:view"?: (view: TimelineSpan) => void;
    /** Hands the consumer a controller once the timeline is up, for panning and zooming it from outside. */
    "onMount"?: (controller: TimelineController) => void;
};

export type TimelineSlots<T> = {
    /** Draws one tick on the ruler. */
    renderTick?: (tick: TimelineTick) => VNodeChild;
    /**
     * Draws one marker, as tall as the timeline, and is told where it is and whether it is in view.
     *
     * Called once per entry of `markers`, with that entry's index, so a playhead and a "now" line can be drawn
     * differently.
     */
    renderMarker?: (props: { marker: TimelineMarker; index: number }) => VNodeChild;
    /** Draws one item. It is handed the interaction state and where the item was placed. */
    renderItem: (props: { item: T; flags: InteractionFlags<TimelineItemRenderProps> }) => VNodeChild;
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
    /** Runs when this item is activated. */
    onActivate: () => void;
    /** Runs when this item takes focus, which is what scrolls it into view. */
    onFocused: () => void;
};

export type TimelineItemSlots = {
    /** Draws the item body. */
    renderContent: (flags: InteractionFlags<TimelineItemRenderProps>) => VNodeChild;
};
