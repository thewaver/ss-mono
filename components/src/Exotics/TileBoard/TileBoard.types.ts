import type { Index2d, Point2d, Rect, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type TileBoardTilingKind =
    | Exclude<
          ShapeConst.DefaultShape,
          "triangle_top_left" | "triangle_top_right" | "triangle_bottom_right" | "triangle_bottom_left"
      >
    | "triangle_ltr"
    | "triangle_rtl"
    | "square_quarters"
    | "lozenge_quarters";

export type TileBoardTileFlip = "none" | "top_to_bottom" | "left_to_right";

export type TileBoardNeighborhood =
    | "orthogonal"
    | "diagonal"
    | "diagonal_and_across"
    | "diagonal_and_down"
    | "upright_triangle"
    | "sideways_triangle"
    | "shared_edge";

export type TileBoardPiece = {
    shape: ShapeConst.DefaultShape;
    box: Rect;
};

export type TileBoardTiling = {
    pitch: Size2d;
    hasOffsetRows: boolean;
    tileFlip: TileBoardTileFlip;
    neighborhood: TileBoardNeighborhood;
    pieces: TileBoardPiece[][];
};

export type TileBoardLayout = TileBoardTiling & {
    tiling: TileBoardTilingKind;
    count: Index2d;
    tileSize: Size2d;
    hasShortFirstRow: boolean;
    taper: number;
};

export type TileBoardTileGeometry = {
    offset: Point2d;
    size: Size2d;
    points: Point2d[];
    isFlipped: boolean;
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
