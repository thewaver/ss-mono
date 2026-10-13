import type { VNodeChild } from "vue";

import type {
    BaseSplitPaneProps,
    InteractionFlags,
    SplitPaneEntry,
    SplitPaneGutterFlags,
} from "@thewaver/ss-components";

export type SplitPaneProps = BaseSplitPaneProps & {
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
