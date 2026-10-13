import type { ReactNode } from "react";

import type {
    BaseSplitPaneProps,
    InteractionFlags,
    SplitPaneEntry,
    SplitPaneGutterFlags,
} from "@thewaver/ss-components";

export type SplitPaneProps = BaseSplitPaneProps & {
    /**
     * How the room is shared between the panes, one ratio per pane, with its setter. It is the only thing that
     * resizes them; the split writes through the setter as a divider moves.
     */
    ratios: readonly [number[], (ratios: number[]) => void];
    /** Draws one pane's contents. */
    renderPane: (pane: SplitPaneEntry, index: number) => ReactNode;
    /** Draws one divider. */
    renderGutter: (flags: InteractionFlags<SplitPaneGutterFlags>) => ReactNode;
};
