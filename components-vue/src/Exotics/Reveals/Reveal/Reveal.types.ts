import type { CSSProperties, VNodeChild } from "vue";

import type { BaseRevealProps } from "@thewaver/ss-components";

export type RevealProps = BaseRevealProps;

export type RevealSlots = {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => VNodeChild;
    /**
     * Draws the covering. It is handed whether the window is open — the pointer inside the element, or the
     * keyboard moving it — and the mask the window cuts into it.
     */
    renderCover: (props: { isRevealing: boolean; maskStyle: CSSProperties }) => VNodeChild;
};
