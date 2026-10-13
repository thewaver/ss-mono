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
    /** Draws one pane's contents. */
    renderPane: Snippet<[pane: SplitPaneEntry, index: number]>;
    /** Draws one divider. */
    renderGutter: Snippet<[flags: InteractionFlags<SplitPaneGutterFlags>]>;
};
