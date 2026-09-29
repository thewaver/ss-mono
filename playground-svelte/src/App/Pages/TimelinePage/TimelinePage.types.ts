import type { TimelineSpan } from "@thewaver/ss-components-svelte";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";

export type TimelineExampleProps = {
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    view: TimelineSpan;
    onPick: (name: string) => void;
};

export type TimelineTrimExampleProps = TimelineExampleProps & {
    clips: Clip[];
    onTrim: (clip: Clip) => void;
};
