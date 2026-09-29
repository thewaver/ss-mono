import type { CarrierAnnouncements } from "../../Abstracts/Carrier/Carrier.types";

export type TimelineSpan = {
    start: number;
    end: number;
};

export type TimelineTick = {
    value: number;
    ratio: number;
    isMajor: boolean;
};

export type TimelineMarker = {
    /** Where the marker sits in time. */
    value: number;
    /** Where it sits across the view, `0` at the left edge and `1` at the right, reaching outside that when it is off screen. */
    ratio: number;
    /** Whether it falls inside the view, so an off-screen marker can be drawn as a pointer to the edge or left out. */
    isInView: boolean;
};

export type TimelineEdge = "start" | "end";

export type TimelineEdgeCarry = {
    index: number;
};

export type TimelineEdgeAnnouncements = CarrierAnnouncements & {
    /** Describes every item while no edge is held, telling a keyboard user which key takes hold of one. */
    restingKeyHint: string;
    /** Tells a keyboard user which keys move the held edge, switch to the other edge, drop it and cancel. */
    heldKeyHint: string;
    /**
     * Names where a held edge has got to, which is what the move and drop announcements say it is at.
     *
     * @param edge Which edge is held.
     * @param span The span the item would have if the edge were dropped there.
     */
    computePlaceLabel: (edge: TimelineEdge, span: TimelineSpan) => string;
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
    /** Which of this item's edges is being moved, so it can be drawn as held. `undefined` while neither is. */
    heldEdge: TimelineEdge | undefined;
};

export type TimelineStop = {
    index: number;
    order: number;
    lane: number;
    span: TimelineSpan;
};

export type TimelineStep = "previous" | "next" | "laneBefore" | "laneAfter" | "first" | "last";

export type TimelineKeyAction =
    | { kind: "cancel" }
    | { kind: "drop" }
    | { kind: "ignore" }
    | { kind: "aim"; edge: TimelineEdge | undefined; nudge: number | undefined }
    | { kind: "hold" }
    | { kind: "activate" }
    | { kind: "step"; step: TimelineStep };

export type TimelineItemBox = {
    left: number;
    width: number;
    top: number;
    height: number;
};

export type TimelineGestureDefs = {
    getIsPannable: () => boolean;
    getIsZoomable: () => boolean;
    getWidth: () => number;
    computePointerRatio: (clientX: number) => number;
    zoomBy: (factor: number, focusRatio: number) => void;
    panBy: (ratio: number) => void;
};

export type TimelineEdgeZoneDefs = {
    getGroupId: () => string;
    getLabel: () => string;
    getRootRef: () => HTMLElement | undefined;
    getIsEditable: () => boolean;
    getAnnouncements: () => TimelineEdgeAnnouncements;
    getHeldEdge: () => TimelineEdge;
    getGrabOffset: () => number;
    getView: () => TimelineSpan;
    getRange: () => TimelineSpan;
    getSpans: () => TimelineSpan[];
    getStep: () => number;
    computePointerRatio: (clientX: number) => number;
    computeSnapValue?: (value: number) => number;
    onSpanChange: (index: number, span: TimelineSpan) => void;
};
