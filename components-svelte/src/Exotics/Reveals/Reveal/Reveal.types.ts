import type { Snippet } from "svelte";

import type { BaseRevealProps } from "@thewaver/ss-components";

export type RevealProps = BaseRevealProps & {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: Snippet;
    /**
     * Draws the covering. It is handed whether the window is open — the pointer inside the element, or the
     * keyboard moving it — and the mask the window cuts into it, as a style to put on the covering element.
     */
    renderCover: Snippet<[isRevealing: boolean, maskStyle: string]>;
};
