import type { CSSProperties, ReactNode } from "react";

import type { BaseScratchCardProps, ScratchCardBrushGeometry } from "@thewaver/ss-components";

export type ScratchCardProps = BaseScratchCardProps & {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => ReactNode;
    /** Draws the covering. It is handed the mask that the scratching cuts into it. */
    renderCover: (maskStyle: CSSProperties) => ReactNode;
    /** Draws the brush that follows the pointer, and is told whether it is currently rubbing. */
    renderBrush?: (isRubbing: boolean, geometry: ScratchCardBrushGeometry) => ReactNode;
};
