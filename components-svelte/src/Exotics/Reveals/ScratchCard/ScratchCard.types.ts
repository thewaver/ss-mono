import type { Snippet } from "svelte";

import type { BaseScratchCardProps, ScratchCardBrushGeometry } from "@thewaver/ss-components";

export type ScratchCardProps = BaseScratchCardProps & {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: Snippet;
    /**
     * Draws the covering. It is handed the mask that the scratching cuts into it, as a style to put on the covering
     * element.
     */
    renderCover: Snippet<[maskStyle: string]>;
    /** Draws the brush that follows the pointer, and is told whether it is currently rubbing. */
    renderBrush?: Snippet<[isRubbing: boolean, geometry: ScratchCardBrushGeometry]>;
};
