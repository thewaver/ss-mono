import type { VNodeChild } from "vue";

import type { BaseTileBoardProps, InteractionFlags, TileBoardRenderProps } from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type TileBoardTileRenderer = (props: {
    tile: Index2d;
    flags: InteractionFlags<TileBoardRenderProps>;
}) => VNodeChild;

export type TileBoardTileProps = InteractionControlProps<TileBoardRenderProps> & {
    /** Which column this tile sits in. */
    colIndex: number;
    /** The contour the tile is cut to. */
    clipPath: string;
    /** How large the tile is. */
    size: Size2d;
    /** Runs when this tile is activated. */
    onActivate: () => void;
    /**
     * Receives the layer that takes the pointer, so the board can tell which tile is under a sweeping press. What it
     * returns runs when the layer goes.
     */
    hitRef?: (element: HTMLElement) => () => void;
};

export type TileBoardProps = BaseTileBoardProps;

export type TileBoardSlots = {
    /** Draws one tile. It is handed the tile and its interaction state, with the contour the board worked out. */
    renderTile: TileBoardTileRenderer;
};
