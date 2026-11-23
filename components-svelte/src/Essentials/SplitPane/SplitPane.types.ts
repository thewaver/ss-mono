import type { Snippet } from "svelte";

import type {
    BaseSplitPaneProps,
    InteractionFlags,
    SplitPaneEntry,
    SplitPaneGutterFlags,
} from "@thewaver/ss-components";

export type SplitPaneProps = BaseSplitPaneProps & {
    /**
     * How the room is shared between the panes, one ratio per pane. Bind it with `bind:ratios`: it is the only thing
     * that resizes them, and the split writes it as a divider moves.
     */
    ratios: number[];
    /**
     * Draws one pane's contents. The pane does not clip what is drawn here, so a box's shadow stays visible:
     * give the drawn box its own `overflow` wherever its content can outgrow a narrowed pane, or it spills into the
     * next one.
     */
    renderPane: Snippet<[pane: SplitPaneEntry, index: number]>;
    /** Draws one divider. */
    renderGutter: Snippet<[flags: InteractionFlags<SplitPaneGutterFlags>]>;
};
