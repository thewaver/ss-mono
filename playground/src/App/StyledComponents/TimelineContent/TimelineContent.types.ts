import type { ParentProps } from "solid-js";

import type { AccessorProps, InteractionFlags, TimelineItemRenderProps, TimelineTick } from "@thewaver/ss-components";

export type TimelineBlockTone = "primary" | "secondary" | "info";

export type PageTimelineTickProps = AccessorProps<{
    tick: TimelineTick;
    label: string;
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
