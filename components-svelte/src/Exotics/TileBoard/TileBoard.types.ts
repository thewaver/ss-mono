import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

import type { BaseTileBoardProps, InteractionFlags, TileBoardRenderProps } from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type TileBoardTileRenderer = Snippet<[tile: Index2d, flags: InteractionFlags<TileBoardRenderProps>]>;

export type TileBoardTileProps = Omit<InteractionControlProps<TileBoardRenderProps>, "renderContent"> & {
    /** Which column this tile sits in. */
    colIndex: number;
    /** The contour the tile is cut to. */
    clipPath: string;
    /** How large the tile is. */
    size: Size2d;
    /** Draws the tile body. */
    renderContent: Snippet<[flags: InteractionFlags<TileBoardRenderProps>]>;
    /** Runs when this tile is activated. */
    onActivate: () => void;
    /**
     * Hands over the layer that takes the pointer, so the board can tell which tile is under a sweeping press. What it
     * returns runs when the layer goes.
     */
    attachHit?: Attachment<HTMLElement>;
};

export type TileBoardProps = BaseTileBoardProps & {
    /** Draws one tile. It is handed the tile and its interaction state, with the contour the board worked out. */
    renderTile: TileBoardTileRenderer;
};
