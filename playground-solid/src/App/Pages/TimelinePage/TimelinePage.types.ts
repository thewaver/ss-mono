import type { AccessorProps, SignalSource, TimelineSpan } from "@thewaver/ss-components-solid";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";

export type TimelineExampleProps = AccessorProps<{
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    view: SignalSource<TimelineSpan>;
    onPick: (name: string) => void;
}>;

export type TimelineTrimExampleProps = TimelineExampleProps &
    AccessorProps<{
        clips: SignalSource<Clip[]>;
        onTrim: (clip: Clip) => void;
    }>;
