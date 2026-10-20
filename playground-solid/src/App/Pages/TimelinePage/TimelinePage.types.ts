import type { AccessorProps, SignalSource } from "@thewaver/ss-components-solid";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import type { Span } from "@thewaver/ss-utils";

export type TimelineExampleProps = AccessorProps<{
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    view: SignalSource<Span>;
    onPick: (name: string) => void;
}>;

export type TimelineTrimExampleProps = TimelineExampleProps &
    AccessorProps<{
        clips: SignalSource<Clip[]>;
        onTrim: (clip: Clip) => void;
    }>;
