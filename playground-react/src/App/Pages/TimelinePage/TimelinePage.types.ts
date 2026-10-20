import type { Dispatch, SetStateAction } from "react";

import type { Clip } from "@thewaver/ss-playground/App/Pages/TimelinePage/TimelineItems.types";
import type { Span } from "@thewaver/ss-utils";

export type TimelineExampleProps = {
    isPannable: boolean;
    isZoomable: boolean;
    isDisabled: boolean;
    view: readonly [Span, (view: Span) => void];
    onPick: (name: string) => void;
};

export type TimelineTrimExampleProps = TimelineExampleProps & {
    clips: readonly [Clip[], Dispatch<SetStateAction<Clip[]>>];
    onTrim: (clip: Clip) => void;
};
