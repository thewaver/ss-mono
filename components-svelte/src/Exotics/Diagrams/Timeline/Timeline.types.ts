import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

import type {
    BaseTimelineProps,
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
} from "@thewaver/ss-components";
import type { Span, SpanTick } from "@thewaver/ss-utils";

export type TimelineController = {
    /**
     * The stretch of time in view. Read inside an effect, a `$derived` or markup, it is followed as the view moves,
     * which is how a consumer's own readout follows a pan without holding the view itself.
     */
    getView: () => Span;
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

export type TimelineProps<T> = BaseTimelineProps<T> & {
    /**
     * The stretch of time currently in view. Bind it with `bind:view` to drive or follow it: it is the only thing that
     * pans or zooms it, and the timeline writes it as it moves. Left unbound, the timeline keeps its own, starting on
     * the whole range.
     */
    view?: Span;
    /** Draws one tick on the ruler. */
    renderTick?: Snippet<[tick: SpanTick]>;
    /**
     * Draws one marker, as tall as the timeline, and is told where it is and whether it is in view.
     *
     * Called once per entry of `markers`, with that entry's index, so a playhead and a "now" line can be drawn
     * differently.
     */
    renderMarker?: Snippet<[marker: TimelineMarker, index: number]>;
    /** Draws one item. It is handed the interaction state and where the item was placed. */
    renderItem: Snippet<[item: T, flags: InteractionFlags<TimelineItemRenderProps>]>;
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
    /** Hands the item element to the wrapper around it, which is what the timeline focuses. */
    attachElement: Attachment<HTMLElement>;
    /** Draws the item body. */
    renderContent: Snippet<[flags: InteractionFlags<TimelineItemRenderProps>]>;
    /** Runs when this item is activated. */
    onActivate: () => void;
    /** Runs when this item, or anything inside it, takes focus, which is what scrolls it into view. */
    onFocused: () => void;
};
