import type { Snippet } from "svelte";

import type {
    BasePageTimelineBlockProps,
    BasePageTimelineLanesProps,
    BasePageTimelineMarkerProps,
    BasePageTimelineTickProps,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.types";

export type {
    PageTimelineFamily,
    TimelineMarkerTone,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.types";

export type PageTimelineTickProps = BasePageTimelineTickProps;

export type PageTimelineMarkerProps = BasePageTimelineMarkerProps;

export type PageTimelineBlockProps = BasePageTimelineBlockProps;

export type PageTimelineLanesProps = BasePageTimelineLanesProps;

export type PageTimelineFrameProps = {
    children?: Snippet;
};
