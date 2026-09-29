import type { Snippet } from "svelte";

import type {
    InteractionFlags,
    TimelineItemRenderProps,
    TimelineMarker,
    TimelineTick,
} from "@thewaver/ss-components-svelte";

export type TimelineBlockTone = "success" | "error" | "alert" | "info";

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
    tone: TimelineBlockTone;
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
