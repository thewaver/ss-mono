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
    /**
     * Draws one pane's contents. The pane does not clip what is drawn here, so a box's shadow stays visible:
     * give the drawn box its own `overflow` wherever its content can outgrow a narrowed pane, or it spills into the
     * next one.
     */
    renderPane: (props: { pane: SplitPaneEntry; index: number }) => VNodeChild;
    /** Draws one divider. */
    renderGutter: (flags: InteractionFlags<SplitPaneGutterFlags>) => VNodeChild;
};
