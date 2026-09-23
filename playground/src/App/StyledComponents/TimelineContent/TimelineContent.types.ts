import type { ParentProps } from "solid-js";

import type {
    AccessorProps,
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineTick,
} from "@thewaver/ss-components";

export type TimelineBlockTone = "success" | "error" | "alert" | "info";

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
    tone: TimelineBlockTone;
    name: string;
    note: string;
}>;

export type PageTimelineLanesProps = AccessorProps<{
    names: string[];
    laneSize: number;
    laneGap: number;
}>;

export type PageTimelineFrameProps = ParentProps;
