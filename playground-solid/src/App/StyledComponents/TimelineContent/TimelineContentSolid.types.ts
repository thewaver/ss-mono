import type { ParentProps } from "solid-js";

import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BasePageTimelineBlockValues,
    BasePageTimelineLanesValues,
    BasePageTimelineMarkerValues,
    BasePageTimelineTickValues,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.types";

export type {
    PageTimelineFamily,
    TimelineMarkerTone,
} from "@thewaver/ss-playground/App/StyledComponents/TimelineContent/TimelineContent.types";

export type PageTimelineTickProps = AccessorValues<BasePageTimelineTickValues>;

export type PageTimelineMarkerProps = AccessorValues<BasePageTimelineMarkerValues>;

export type PageTimelineBlockProps = AccessorValues<BasePageTimelineBlockValues>;

export type PageTimelineLanesProps = AccessorValues<BasePageTimelineLanesValues>;

export type PageTimelineFrameProps = ParentProps;
