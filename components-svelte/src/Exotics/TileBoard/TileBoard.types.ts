import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

import type { InteractionFlags, TileBoardRenderProps } from "@thewaver/ss-components";
import type { Index2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type TileBoardTileRenderer = Snippet<[tile: Index2d, flags: InteractionFlags<TileBoardRenderProps>]>;

export type TileBoardTileProps = Omit<InteractionControlProps<TileBoardRenderProps>, "renderContent"> & {
    /** Which column this tile sits in. */
    colIndex: number;
    /** The outline the tile is cut to. */
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

export type TileBoardProps = {
    /** Names the board for assistive technology. */
    ariaLabel?: string;
    /** How many tiles the board has, across and down. */
    tileCount: Index2d;
    /** How large one tile is. */
    tileSize: Size2d;
    /** The outline each tile is cut to, which also decides whether rows are offset. */
    tileShape?: ShapeConst.DefaultShape;
    /** The space between tiles. */
    gap?: number;
    /** Starts the offset rows at the top instead of the second row, for shapes that stagger. */
    hasShortFirstRow?: boolean;
    /**
     * How wide the top of the board is drawn, as a fraction of the bottom, which leans the board away from
     * the viewer like a table seen from one end. `1`, the default, is flat. The tiles still meet edge to
     * edge and a press still lands on the tile drawn under it. Something standing on the board rather than
     * painted into a tile is placed with `TileBoardUtils.getTileCenter` and sized with
     * `TileBoardUtils.getTileScale`, which both account for it.
     */
    taper?: number;
    /** Turns the board off, so no tile responds. */
    isDisabled?: boolean;
    /** Whether one tile is unavailable, which is what paints a move as out of reach. */
    computeIsTileDisabled?: (tile: Index2d) => boolean;
    /** Names one tile for assistive technology, so a reader hears where it is rather than its number. */
    computeTileAriaLabel?: (tile: Index2d) => string;
    /** Draws one tile. It is handed the tile and its interaction state, with the outline the board worked out. */
    renderTile: TileBoardTileRenderer;
    /** Runs when a tile is activated. */
    onTileActivate: (tile: Index2d) => void;
    /**
     * Runs for each tile a press is dragged across, so one stroke can paint or clear a run of tiles. Sweeping is
     * on only while this is given.
     *
     * A sweep starts when a press moves onto a second tile: the tile it began on is reported then, and every tile
     * entered after it, each once per press however often the pointer comes back. A press that never leaves its
     * tile is a click and goes to `onTileActivate` instead, and the click at the end of a sweep is swallowed, so
     * no tile is acted on twice. Refused tiles are passed over without being reported. Touch sweeps as the mouse
     * does, and a touch that lands on a tile drags across the board rather than scrolling the page. Pressing the
     * tiles one at a time, or walking them with the keyboard, reaches everything a sweep does.
     */
    onTileSweep?: (tile: Index2d) => void;
};
