import type { Dispatch, SetStateAction } from "react";

import type { TimelineSpan } from "@thewaver/ss-components-react";
import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";

export type TimelineExampleProps = {
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    viewState: readonly [TimelineSpan, (view: TimelineSpan) => void];
    onPick: (name: string) => void;
};

export type TimelineTrimExampleProps = TimelineExampleProps & {
    clipsState: readonly [Clip[], Dispatch<SetStateAction<Clip[]>>];
    onTrim: (clip: Clip) => void;
};
