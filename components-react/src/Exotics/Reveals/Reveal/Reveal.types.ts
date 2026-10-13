import type { CSSProperties, ReactNode } from "react";

import type { BaseRevealProps } from "@thewaver/ss-components";

export type RevealProps = BaseRevealProps & {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => ReactNode;
    /**
     * Draws the covering. It is handed whether the window is open — the pointer inside the element, or the
     * keyboard moving it — and the mask the window cuts into it.
     */
    renderCover: (isRevealing: boolean, maskStyle: CSSProperties) => ReactNode;
};
