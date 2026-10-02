import type { Index2d, Point2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

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
    taper: number;
};

export type TileBoardKeyAction = { kind: "activate" } | { kind: "move"; tile: Index2d };

export type TileBoardSweepDefs = {
    getIsSweepable: () => boolean;
    getIsTileDisabled: (tile: Index2d) => boolean;
    onSweep: (tile: Index2d) => void;
};

export type TileBoardRenderProps = {
    /** Which tile this is, by column and row. */
    tile: Index2d;
    /** How large the tile is. */
    size: Size2d;
    /** The corners of the tile's contour, for a consumer drawing something other than a rectangle. */
    points: Point2d[];
    /** Whether this tile sits on an offset row, which for a hexagon decides which way round it is drawn. */
    isFlipped: boolean;
    /** Whether the keyboard is currently on this tile. */
    isHighlighted: boolean;
};
