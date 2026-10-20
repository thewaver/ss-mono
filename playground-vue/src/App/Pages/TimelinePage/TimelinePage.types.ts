import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import type { Span } from "@thewaver/ss-utils";

export type TimelineExampleProps = {
    "isPannable": boolean;
    "isZoomable": boolean;
    "isDisabled": boolean;
    "view": Span;
    "onUpdate:view"?: (view: Span) => void;
    "onPick": (name: string) => void;
};

export type TimelineTrimExampleProps = TimelineExampleProps & {
    "clips": Clip[];
    "onUpdate:clips"?: (clips: Clip[]) => void;
    "onTrim": (clip: Clip) => void;
};
