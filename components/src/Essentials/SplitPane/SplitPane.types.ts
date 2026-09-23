import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SplitPaneOrientation = "horizontal" | "vertical";

export type SplitPaneGutterFlags = {
    isDragging: boolean;
};

export type SplitPaneEntry = {
    id?: string;
    minPx?: number;
    maxPx?: number;
    gutterAriaLabel?: string;
};

export type SplitPaneProps = AccessorProps<{
    /** Whether the panes sit side by side, `"horizontal"`, or stacked, `"vertical"`. The dividers run the other way, so a horizontal split has upright dividers. */
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
    /** How the room is shared between the panes. It is the only thing that resizes them. */
    ratiosSignal: SignalSource<number[]>;
    /** Draws one pane's contents. */
    renderPane: (getPane: Accessor<SplitPaneEntry>, index: number) => JSX.Element;
    /** Draws one divider. */
    renderGutter: (getFlags: () => InteractionFlags<SplitPaneGutterFlags>) => JSX.Element;
}>;
