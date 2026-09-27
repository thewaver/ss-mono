import type { AccessorProps, SignalSource, TimelineSpan } from "@thewaver/ss-components-solid";
import type { Clip } from "@thewaver/ss-playground-core/App/Pages/TimelinePage/TimelineItems.types";

export type TimelineExampleProps = AccessorProps<{
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    viewSignal: SignalSource<TimelineSpan>;
    onPick: (name: string) => void;
}>;

export type TimelineTrimExampleProps = TimelineExampleProps &
    AccessorProps<{
        clipsSignal: SignalSource<Clip[]>;
        onTrim: (clip: Clip) => void;
    }>;
