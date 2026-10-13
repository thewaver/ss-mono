import type { Accessor, JSX } from "solid-js";

import type {
    BaseSplitPaneValues,
    InteractionFlags,
    SplitPaneEntry,
    SplitPaneGutterFlags,
} from "@thewaver/ss-components";

import type { AccessorProps, AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type SplitPaneProps = AccessorValues<BaseSplitPaneValues> &
    AccessorProps<{
        /** How the room is shared between the panes. It is the only thing that resizes them. */
        ratios: SignalSource<number[]>;
        /** Draws one pane's contents. */
        renderPane: (getPane: Accessor<SplitPaneEntry>, index: number) => JSX.Element;
        /** Draws one divider. */
        renderGutter: (getFlags: () => InteractionFlags<SplitPaneGutterFlags>) => JSX.Element;
    }>;
