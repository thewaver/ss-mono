import type { Accessor, JSX } from "solid-js";

import type { Index2d, Point2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { InteractionControlProps } from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type TileBoardTileFlip = "none" | "topToBottom" | "leftToRight";

export type TileBoardNeighborhood =
    "orthogonal" | "diagonal" | "diagonalAndAcross" | "diagonalAndDown" | "uprightTriangle" | "sidewaysTriangle";

export type TileBoardTiling = {
    pitch: Size2d;
    hasOffsetRows: boolean;
    tileFlip: TileBoardTileFlip;
    neighborhood: TileBoardNeighborhood;
};

export type TileBoardLayout = TileBoardTiling & {
    shape: ShapeConst.DefaultShape;
    count: Index2d;
    tileSize: Size2d;
    hasShortFirstRow: boolean;
};

export type TileBoardRenderProps = {
    /** Which tile this is, by column and row. */
    tile: Index2d;
    /** How large the tile is. */
    size: Size2d;
    /** The corners of the tile's outline, for a consumer drawing something other than a rectangle. */
    points: Point2d[];
    /** Whether this tile sits on an offset row, which for a hexagon decides which way round it is drawn. */
    isFlipped: boolean;
    /** Whether the keyboard is currently on this tile. */
    isHighlighted: boolean;
};

export type TileBoardTileRenderer = (
    getTile: Accessor<Index2d>,
    getRenderProps: () => InteractionFlags<TileBoardRenderProps>,
) => JSX.Element;

export type TileBoardTileProps = AccessorProps<
    Omit<InteractionControlProps<TileBoardRenderProps>, "renderContent"> & {
        /** Which column this tile sits in. */
        colIndex: number;
        /** The outline the tile is cut to. */
        clipPath: string;
        /** How large the tile is. */
        size: Size2d;
        /** Draws the tile body. */
        renderContent: (getRenderProps: () => InteractionFlags<TileBoardRenderProps>) => JSX.Element;
        /** Runs when this tile is activated. */
        onActivate: () => void;
    }
>;

export type TileBoardProps = AccessorProps<{
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
    /** Turns the board off, so no tile responds. */
    isDisabled?: boolean;
    /** Whether one tile is unavailable, which is what paints a move as out of reach. */
    computeIsTileDisabled?: (tile: Index2d) => boolean;
    /** Names one tile for assistive technology, so a reader hears where it is rather than its number. */
    computeTileAriaLabel?: (tile: Index2d) => string;
    /** Draws one tile. */
    renderTile: TileBoardTileRenderer;
    /** Runs when a tile is activated. */
    onTileActivate: (tile: Index2d) => void;
}>;
