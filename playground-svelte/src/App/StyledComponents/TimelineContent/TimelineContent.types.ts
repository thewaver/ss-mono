import type { Snippet } from "svelte";

import type {
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineTick,
} from "@thewaver/ss-components-svelte";
import type { PAGE_TIMELINE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.css";

export type PageTimelineFamily = (typeof PAGE_TIMELINE_FAMILIES)[number];

export type TimelineMarkerTone = "now" | "playhead";

export type PageTimelineTickProps = {
    tick: TimelineTick;
    label: string;
};

export type PageTimelineMarkerProps = {
    marker: TimelineMarker;
    tone: TimelineMarkerTone;
};

export type PageTimelineBlockProps = {
    flags: InteractionFlags<TimelineItemRenderProps>;
    family: PageTimelineFamily;
    name: string;
    note: string;
};

export type PageTimelineLanesProps = {
    names: string[];
    laneSize: number;
    laneGap: number;
};

export type PageTimelineFrameProps = {
    children?: Snippet;
};
