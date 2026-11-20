import type { Count2d, Index2d, Point2d, Rect, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type SVGPatternCellPiece = { shape: ShapeConst.DefaultShape; box: Rect };

export type SVGPatternLayout = {
    computeCellCount: (requested: Count2d) => Count2d;
    computePatternSize: (cellCount: Count2d, cellSize: Size2d) => Size2d;
    computeCellPos: (index: Index2d, cellSize: Size2d) => Point2d;
    computeIsSplit: (index: Index2d, cellCount: Count2d) => boolean;
    computeCellPiece?: (index: Index2d) => SVGPatternCellPiece;
};

export type SVGPatternKind =
    | "grid"
    | "diagonal"
    | "half_shift"
    | "half_drop"
    | "triangle"
    | "triangle_sideways"
    | "hex_pointy_top"
    | "hex_flat_top"
    | "triangle_ltr"
    | "triangle_rtl"
    | "square_quarters"
    | "lozenge_quarters";
