import type { VNodeChild } from "vue";

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
    "orientation"?: SplitPaneOrientation;
    /** How wide the draggable divider between two panes is. */
    "gutterSize"?: number;
    /** How far one press of an arrow key moves a divider. */
    "keyStep"?: number;
    /** Names the split for assistive technology. */
    "ariaLabel"?: string;
    /** Turns the dividers off, so the panes keep the sizes they have. */
    "isDisabled"?: boolean;
    /** The panes, each able to state its own smallest and largest size. */
    "panes": SplitPaneEntry[];
    /**
     * How the room is shared between the panes, one ratio per pane. It is the only thing that resizes them; the split
     * writes it back as a divider moves.
     */
    "ratios": number[];
    /** Receives the ratios as a divider moves, which is what `v-model:ratios` binds. */
    "onUpdate:ratios"?: (ratios: number[]) => void;
};

export type SplitPaneSlots = {
    /** Draws one pane's contents. */
    renderPane: (props: { pane: SplitPaneEntry; index: number }) => VNodeChild;
    /** Draws one divider. */
    renderGutter: (flags: InteractionFlags<SplitPaneGutterFlags>) => VNodeChild;
};
