import type { TimelineSpan } from "@thewaver/ss-components-vue";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";

export type TimelineExampleProps = {
    "isPannable": boolean;
    "isZoomable": boolean;
    "isDisabled": boolean;
    "view": TimelineSpan;
    "onUpdate:view"?: (view: TimelineSpan) => void;
    "onPick": (name: string) => void;
};

export type TimelineTrimExampleProps = TimelineExampleProps & {
    "clips": Clip[];
    "onUpdate:clips"?: (clips: Clip[]) => void;
    "onTrim": (clip: Clip) => void;
};
