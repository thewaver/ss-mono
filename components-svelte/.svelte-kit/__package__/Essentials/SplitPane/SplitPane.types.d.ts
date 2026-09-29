import type { Snippet } from "svelte";
import type { InteractionFlags, SplitPaneEntry, SplitPaneGutterFlags, SplitPaneOrientation } from "@thewaver/ss-components";
export type SplitPaneProps = {
    /**
     * Whether the panes sit side by side, `"horizontal"`, or stacked, `"vertical"`. The dividers run the other way,
     * so a horizontal split has upright dividers.
     */
    orientation?: SplitPaneOrientation;
    /** How wide the draggable divider between two panes is. */
    gutterSize?: number;
    /** How far one press of an arrow key moves a divider. */
    keyStep?: number;
    /** Names the split for assistive technology. */
    ariaLabel?: string;
    /** Turns the dividers off, so the panes keep the sizes they have. */
    isDisabled?: boolean;
    /** The panes, each able to state its own smallest and largest size. */
    panes: SplitPaneEntry[];
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
