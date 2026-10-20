import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import type { Span } from "@thewaver/ss-utils";

export type TimelineExampleProps = {
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    view: Span;
    onPick: (name: string) => void;
};

export type TimelineTrimExampleProps = TimelineExampleProps & {
    clips: Clip[];
    onTrim: (clip: Clip) => void;
};
