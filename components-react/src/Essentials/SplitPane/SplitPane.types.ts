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
    /**
     * Draws one pane's contents. The pane does not clip what is drawn here, so a box's shadow stays visible:
     * give the drawn box its own `overflow` wherever its content can outgrow a narrowed pane, or it spills into the
     * next one.
     */
    renderPane: (pane: SplitPaneEntry, index: number) => ReactNode;
    /** Draws one divider. */
    renderGutter: (flags: InteractionFlags<SplitPaneGutterFlags>) => ReactNode;
};
