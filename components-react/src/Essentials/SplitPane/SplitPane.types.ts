import type { ReactNode } from "react";

import type {
    InteractionFlags,
    SplitPaneEntry,
    SplitPaneGutterFlags,
    SplitPaneOrientation,
} from "@thewaver/ss-components";

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
     * How the room is shared between the panes, one ratio per pane, with its setter. It is the only thing that
     * resizes them; the split writes through the setter as a divider moves.
     */
    ratios: readonly [number[], (ratios: number[]) => void];
    /** Draws one pane's contents. */
    renderPane: (pane: SplitPaneEntry, index: number) => ReactNode;
    /** Draws one divider. */
    renderGutter: (flags: InteractionFlags<SplitPaneGutterFlags>) => ReactNode;
};
