import type { ParentProps } from "solid-js";

import type {
    AccessorProps,
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineTick,
} from "@thewaver/ss-components-solid";
import type { PAGE_TIMELINE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

export type PageTimelineFamily = (typeof PAGE_TIMELINE_FAMILIES)[number];

export type TimelineMarkerTone = "now" | "playhead";

export type PageTimelineTickProps = AccessorProps<{
    tick: TimelineTick;
    label: string;
}>;

export type PageTimelineMarkerProps = AccessorProps<{
    marker: TimelineMarker;
    tone: TimelineMarkerTone;
}>;

export type PageTimelineBlockProps = AccessorProps<{
    flags: InteractionFlags<TimelineItemRenderProps>;
    family: PageTimelineFamily;
    name: string;
    note: string;
}>;

export type PageTimelineLanesProps = AccessorProps<{
    names: string[];
    laneSize: number;
    laneGap: number;
}>;

export type PageTimelineFrameProps = ParentProps;
