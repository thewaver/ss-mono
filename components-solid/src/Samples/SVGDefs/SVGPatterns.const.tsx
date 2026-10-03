import { createMemo, untrack } from "solid-js";

import {
    type SVGPatternCellCount,
    type SVGPatternKind,
    SVGPatternLayouts,
    type TrackedPatternElementDefs,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGPatternDefsSolidUtils } from "../../Generators/SVGDefs/SVGPatterns/SVGPatternDefsSolid.utils";
import type { SVGPatternCellRenderer, SVGPatternTrackedCellRenderer } from "./SVGPatternsSolid.types";

const NO_REF = () => undefined;

const getIsSameCellCount = (a: SVGPatternCellCount, b: SVGPatternCellCount) => a.rows === b.rows && a.cols === b.cols;

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

        return SVGPatternDefsSolidUtils.computePattern(
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
    ) => computeLayoutPattern("halfShift", id, cellCount, cellSize, renderCell);

    export const computeHalfDropPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("halfDrop", id, cellCount, cellSize, renderCell);

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
    ) => computeLayoutPattern("triangleSideways", id, cellCount, cellSize, renderCell);

    export const computeHexPointyTopPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("hexPointyTop", id, cellCount, cellSize, renderCell);

    export const computeHexFlatTopPattern = (
        id: string,
        cellCount: SVGPatternCellCount,
        cellSize: Size2d,
        renderCell: SVGPatternCellRenderer,
    ) => computeLayoutPattern("hexFlatTop", id, cellCount, cellSize, renderCell);

    export const computeTrackedLayoutPattern = (
        kind: SVGPatternKind,
        id: string,
        getRef: (() => HTMLElement | undefined) | undefined,
        defs: TrackedPatternElementDefs,
        opts: ReturnType<typeof TrackedPatternUtils.resolveOpts>,
        renderCell: SVGPatternTrackedCellRenderer,
    ) => {
        const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRef ?? NO_REF);
        const getCellCount = createMemo(
            () => TrackedPatternUtils.computeCellCount(kind, opts.isTiled, defs.cellSize, defs.getSize()),
            undefined,
            { equals: getIsSameCellCount },
        );
        const getPointer = createMemo(() =>
            TrackedPatternUtils.computePointerPoint(getReading(), getIsPointerPresent(), defs.getSize()),
        );

        const getPattern = createMemo(() => {
            const cellCount = getCellCount();

            return untrack(() =>
                computeLayoutPattern(kind, id, cellCount, defs.cellSize, (cellId, index, count, isSplit) =>
                    renderCell(cellId, index, isSplit, () =>
                        TrackedPatternUtils.computeLevel(kind, index, count, defs.cellSize, getPointer(), opts),
                    ),
                ),
            );
        });

        return <>{getPattern()}</>;
    };
}
