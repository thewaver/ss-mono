import { type SVGPatternCellCount, type SVGPatternKind } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";
import type { SVGPatternCellRenderer } from "./SVGPatternsSvelte.types.js";
export declare namespace SVGPatterns {
    const computeLayoutPattern: (kind: SVGPatternKind, id: string, requestedCellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeGridPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeDiagonalPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeHalfShiftPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeHalfDropPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeTrianglePattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeTriangleSidewaysPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeHexPointyTopPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
    const computeHexFlatTopPattern: (id: string, cellCount: SVGPatternCellCount, cellSize: Size2d, renderCell: SVGPatternCellRenderer) => import("../../index.js").MarkupElement<{
        id: string;
        cellCount: {
            rows: number;
            cols: number;
        };
        patternSize: Size2d;
        computeCellPos: (index: import("@thewaver/ss-utils").Index2d) => import("@thewaver/ss-utils").Point2d;
        renderCell: (id: string, index: import("@thewaver/ss-utils").Index2d, cellCount: {
            rows: number;
            cols: number;
        }) => import("../../index.js").SvelteMarkup;
    }>;
}
