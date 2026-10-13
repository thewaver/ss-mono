import type { CSSProperties, VNodeChild } from "vue";

import type { BaseScratchCardProps, ScratchCardBrushGeometry } from "@thewaver/ss-components";

export type ScratchCardProps = BaseScratchCardProps;

export type ScratchCardSlots = {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => VNodeChild;
    /** Draws the covering. It is handed the mask that the scratching cuts into it. */
    renderCover: (maskStyle: CSSProperties) => VNodeChild;
    /** Draws the brush that follows the pointer, and is told whether it is currently rubbing. */
    renderBrush: (props: { isRubbing: boolean; geometry: ScratchCardBrushGeometry }) => VNodeChild;
};
