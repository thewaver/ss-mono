import {
    type SVGPatternCellCount,
    type SVGPatternKind,
    SVGPatternLayouts,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import { SVGPatternDefsReactUtils } from "../../Generators/SVGDefs/SVGPatterns/SVGPatternDefsReact.utils";
import type { SVGPatternCellRenderer, SVGPatternTrackedCellRenderer } from "./SVGPatternsReact.types";

export namespace SVGPatterns {
    export const computeLayoutPattern = (
        kind: SVGPatternKind,
        id: string,
        requestedCellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => {
        const layout = SVGPatternLayouts.ALL[kind];
        const cellCount = layout.computeCellCount(requestedCellCount);

        return SVGPatternDefsReactUtils.computePattern(
            id,
            cellCount,
            layout.computePatternSize(cellCount, cellSize),
            (index) => layout.computeCellPos(index, cellSize),
            (cellId, index, count) => renderCell(cellId, index, count, layout.computeIsSplit(index, count)),
        );
    };

    export const computeGridPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("grid", id, cellCount, cellSize, renderCell);

    export const computeDiagonalPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("diagonal", id, cellCount, cellSize, renderCell);

    export const computeHalfShiftPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("half_shift", id, cellCount, cellSize, renderCell);

    export const computeHalfDropPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("half_drop", id, cellCount, cellSize, renderCell);

    export const computeTrianglePattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("triangle", id, cellCount, cellSize, renderCell);

    export const computeTriangleSidewaysPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("triangle_sideways", id, cellCount, cellSize, renderCell);

    export const computeHexPointyTopPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("hex_pointy_top", id, cellCount, cellSize, renderCell);

    export const computeHexFlatTopPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("hex_flat_top", id, cellCount, cellSize, renderCell);

    export const computeTrackedLayoutPattern = (
        kind: SVGPatternKind,
        id: string,
        cellSize: Size2d,
        areaSize: Size2d,
        pointer: Point2d | undefined,
        opts: ReturnType<typeof TrackedPatternUtils.resolveOpts>,
        computeTrailLevel: (key: string, liveLevel: number) => number,
        renderCell: SVGPatternTrackedCellRenderer,
    ) =>
        computeLayoutPattern(
            kind,
            id,
            TrackedPatternUtils.computeCellCount(kind, opts.isTiled, cellSize, areaSize),
            cellSize,
            (cellId, index, count, isSplit) =>
                renderCell(
                    cellId,
                    index,
                    isSplit,
                    computeTrailLevel(
                        `${index.row}_${index.col}`,
                        TrackedPatternUtils.computeLevel(kind, index, count, cellSize, pointer, opts),
                    ),
                ),
        );
}
