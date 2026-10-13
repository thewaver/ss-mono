import type { Accessor, JSX } from "solid-js";

import type { BaseScratchCardCbs, BaseScratchCardValues, ScratchCardBrushGeometry } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type ScratchCardProps = AccessorValues<BaseScratchCardValues> &
    BaseScratchCardCbs & {
        /** Draws what is underneath, waiting to be revealed. */
        renderContent: () => JSX.Element;
        /** Draws the covering. It is handed the mask that the scratching cuts into it. */
        renderCover: (getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
        /** Draws the brush that follows the pointer, and is told whether it is currently rubbing. */
        renderBrush?: (getIsRubbing: () => boolean, getGeometry: Accessor<ScratchCardBrushGeometry>) => JSX.Element;
    };
