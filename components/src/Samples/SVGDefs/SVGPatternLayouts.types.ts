import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type SVGPatternCellCount = { rows: number; cols: number };

export type SVGPatternCellIndex = { row: number; col: number };

export type SVGPatternLayout = {
    computeCellCount: (requested: SVGPatternCellCount) => SVGPatternCellCount;
    computePatternSize: (cellCount: SVGPatternCellCount, cellSize: Size2d) => Size2d;
    computeCellPos: (index: SVGPatternCellIndex, cellSize: Size2d) => Point2d;
    computeIsSplit: (index: SVGPatternCellIndex, cellCount: SVGPatternCellCount) => boolean;
};

export type SVGPatternKind =
    "grid" | "diagonal" | "halfShift" | "halfDrop" | "triangle" | "triangleSideways" | "hexPointyTop" | "hexFlatTop";
