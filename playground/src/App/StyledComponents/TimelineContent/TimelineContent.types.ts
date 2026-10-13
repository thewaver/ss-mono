import type { InteractionFlags, TimelineItemRenderProps, TimelineMarker, TimelineTick } from "@thewaver/ss-components";

import type { PAGE_TIMELINE_FAMILIES } from "./TimelineContent.css";

export type PageTimelineFamily = (typeof PAGE_TIMELINE_FAMILIES)[number];

export type TimelineMarkerTone = "now" | "playhead";

export type BasePageTimelineTickValues = {
    tick: TimelineTick;
    label: string;
};

export type BasePageTimelineTickProps = BasePageTimelineTickValues;

export type BasePageTimelineMarkerValues = {
    marker: TimelineMarker;
    tone: TimelineMarkerTone;
};

export type BasePageTimelineMarkerProps = BasePageTimelineMarkerValues;

export type BasePageTimelineBlockValues = {
    flags: InteractionFlags<TimelineItemRenderProps>;
    family: PageTimelineFamily;
    name: string;
    note: string;
};

export type BasePageTimelineBlockProps = BasePageTimelineBlockValues;

export type BasePageTimelineLanesValues = {
    names: string[];
    laneSize: number;
    laneGap: number;
};

export type BasePageTimelineLanesProps = BasePageTimelineLanesValues;
