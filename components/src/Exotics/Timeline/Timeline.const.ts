import type { TimelineEdgeAnnouncements } from "./Timeline.types";

const SILENT = () => "";

const SILENT_EDGE_ANNOUNCEMENTS: TimelineEdgeAnnouncements = {
    restingKeyHint: "",
    heldKeyHint: "",
    computePlaceLabel: SILENT,
    computePickedUp: SILENT,
    computePickedUpByKey: SILENT,
    computeAimed: SILENT,
    computeZoneEntered: SILENT,
    computeReturned: SILENT,
    computeLeftInPlace: SILENT,
    computeRefused: SILENT,
    computeDropped: SILENT,
};

export const TIMELINE_DEFAULTS = {
    laneGap: 4,
    axisSize: 0,
    minTickGap: 64,
    edgeGrabSize: 24,
    edgeAnnouncements: SILENT_EDGE_ANNOUNCEMENTS,
};
