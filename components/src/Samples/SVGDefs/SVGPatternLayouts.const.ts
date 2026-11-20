import { type Count2d, type Index2d, MathUtils } from "@thewaver/ss-utils";

import type { SVGPatternCellPiece, SVGPatternKind, SVGPatternLayout } from "./SVGPatternLayouts.types";

const WHOLE_CELL = { x: 0, y: 0, width: 1, height: 1 };

const HALVES_RISING: SVGPatternCellPiece[] = [
    { shape: "triangle_top_left", box: WHOLE_CELL },
    { shape: "triangle_bottom_right", box: WHOLE_CELL },
];

const HALVES_FALLING: SVGPatternCellPiece[] = [
    { shape: "triangle_bottom_left", box: WHOLE_CELL },
    { shape: "triangle_top_right", box: WHOLE_CELL },
];

const QUARTERS: SVGPatternCellPiece[] = [
    { shape: "triangle_right", box: { x: 0, y: 0, width: 0.5, height: 1 } },
    { shape: "triangle_down", box: { x: 0, y: 0, width: 1, height: 0.5 } },
    { shape: "triangle_up", box: { x: 0, y: 0.5, width: 1, height: 0.5 } },
    { shape: "triangle_left", box: { x: 0.5, y: 0, width: 0.5, height: 1 } },
];

const toOdd = (value: number) => value + (MathUtils.isOdd(value) ? 0 : 1);

const toEven = (value: number) => value + (MathUtils.isEven(value) ? 0 : 1);

const isFirstOrLastCol = (index: Index2d, cellCount: Count2d) =>
    index.col === 0 || index.col === cellCount.colCount - 1;

const isFirstOrLastRow = (index: Index2d, cellCount: Count2d) =>
    index.row === 0 || index.row === cellCount.rowCount - 1;

const createCutLayout = (pieces: SVGPatternCellPiece[][]): SVGPatternLayout => {
    const perCell = pieces[0].length;
    const isChecked = pieces.length > 1;
    const toBoxCol = (index: Index2d) => Math.floor(index.col / perCell);

    return {
        computeCellCount: (requested) => ({
            rowCount: isChecked ? toEven(requested.rowCount) : requested.rowCount,
            colCount: (isChecked ? toEven(requested.colCount) : requested.colCount) * perCell,
        }),
        computePatternSize: (cellCount, cellSize) => ({
            width: cellSize.width * Math.ceil(cellCount.colCount / perCell),
            height: cellSize.height * cellCount.rowCount,
        }),
        computeCellPos: (index, cellSize) => ({
            x: toBoxCol(index) * cellSize.width,
            y: index.row * cellSize.height,
        }),
        computeIsSplit: () => false,
        computeCellPiece: (index) =>
            pieces[MathUtils.wrapIndex(index.row + toBoxCol(index), pieces.length)][
                MathUtils.wrapIndex(index.col, perCell)
            ],
    };
};

export namespace SVGPatternLayouts {
    export const ALL: Record<SVGPatternKind, SVGPatternLayout> = {
        grid: {
            computeCellCount: (requested) => requested,
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * cellCount.colCount,
                height: cellSize.height * cellCount.rowCount,
            }),
            computeCellPos: (index, cellSize) => ({
                x: index.col * cellSize.width,
                y: index.row * cellSize.height,
            }),
            computeIsSplit: () => false,
        },
        diagonal: {
            computeCellCount: (requested) => ({
                rowCount: toOdd(requested.rowCount * 2),
                colCount: toOdd(requested.colCount),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * (cellCount.colCount - 1),
                height: cellSize.height * (cellCount.rowCount * 0.5 - 0.5),
            }),
            computeCellPos: (index, cellSize) => ({
                x: cellSize.width * index.col - (MathUtils.isEven(index.row) ? cellSize.width * 0.5 : 0),
                y: cellSize.height * (index.row - 1) * 0.5,
            }),
            computeIsSplit: (index, cellCount) =>
                (MathUtils.isEven(index.row) && isFirstOrLastCol(index, cellCount)) ||
                isFirstOrLastRow(index, cellCount),
        },
        half_shift: {
            computeCellCount: (requested) => ({
                rowCount: toEven(requested.rowCount),
                colCount: toOdd(requested.colCount),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * (cellCount.colCount - 1),
                height: cellSize.height * cellCount.rowCount,
            }),
            computeCellPos: (index, cellSize) => ({
                x: index.col * cellSize.width - (MathUtils.isEven(index.row) ? cellSize.width * 0.5 : 0),
                y: index.row * cellSize.height,
            }),
            computeIsSplit: (index, cellCount) => isFirstOrLastCol(index, cellCount) && MathUtils.isEven(index.row),
        },
        half_drop: {
            computeCellCount: (requested) => ({
                rowCount: toOdd(requested.rowCount),
                colCount: toEven(requested.colCount),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * cellCount.colCount,
                height: cellSize.height * (cellCount.rowCount - 1),
            }),
            computeCellPos: (index, cellSize) => ({
                x: index.col * cellSize.width,
                y: index.row * cellSize.height - (MathUtils.isEven(index.col) ? cellSize.height * 0.5 : 0),
            }),
            computeIsSplit: (index, cellCount) => MathUtils.isEven(index.col) && isFirstOrLastRow(index, cellCount),
        },
        triangle: {
            computeCellCount: (requested) => ({
                rowCount: toEven(requested.rowCount),
                colCount: toOdd(requested.colCount * 2),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * Math.round((cellCount.colCount - 1) * 0.5),
                height: cellSize.height * cellCount.rowCount,
            }),
            computeCellPos: (index, cellSize) => ({
                x: (index.col - 1) * cellSize.width * 0.5,
                y: index.row * cellSize.height,
            }),
            computeIsSplit: (index, cellCount) => isFirstOrLastCol(index, cellCount),
        },
        triangle_sideways: {
            computeCellCount: (requested) => ({
                rowCount: toOdd(requested.rowCount * 2),
                colCount: toEven(requested.colCount),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * cellCount.colCount,
                height: cellSize.height * Math.round((cellCount.rowCount - 1) * 0.5),
            }),
            computeCellPos: (index, cellSize) => ({
                x: index.col * cellSize.width,
                y: (index.row - 1) * cellSize.height * 0.5,
            }),
            computeIsSplit: (index, cellCount) => isFirstOrLastRow(index, cellCount),
        },
        hex_pointy_top: {
            computeCellCount: (requested) => ({
                rowCount: toOdd(requested.rowCount),
                colCount: toOdd(requested.colCount),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * (cellCount.colCount - 1),
                height: cellSize.height * (cellCount.rowCount - 1) * 0.75,
            }),
            computeCellPos: (index, cellSize) => ({
                x: index.col * cellSize.width - (MathUtils.isEven(index.row) ? cellSize.width * 0.5 : 0),
                y: index.row * cellSize.height * 0.75 - cellSize.height * 0.5,
            }),
            computeIsSplit: (index, cellCount) =>
                (MathUtils.isEven(index.row) && isFirstOrLastCol(index, cellCount)) ||
                isFirstOrLastRow(index, cellCount),
        },
        hex_flat_top: {
            computeCellCount: (requested) => ({
                rowCount: toOdd(requested.rowCount),
                colCount: toOdd(requested.colCount),
            }),
            computePatternSize: (cellCount, cellSize) => ({
                width: cellSize.width * (cellCount.colCount - 1) * 0.75,
                height: cellSize.height * (cellCount.rowCount - 1),
            }),
            computeCellPos: (index, cellSize) => ({
                x: index.col * cellSize.width * 0.75 - cellSize.width * 0.5,
                y: index.row * cellSize.height - (MathUtils.isEven(index.col) ? cellSize.height * 0.5 : 0),
            }),
            computeIsSplit: (index, cellCount) =>
                (MathUtils.isEven(index.col) && isFirstOrLastRow(index, cellCount)) ||
                isFirstOrLastCol(index, cellCount),
        },
        triangle_ltr: createCutLayout([HALVES_FALLING]),
        triangle_rtl: createCutLayout([HALVES_RISING]),
        square_quarters: createCutLayout([QUARTERS]),
        lozenge_quarters: createCutLayout([HALVES_RISING, HALVES_FALLING]),
    };

    export const getLayout = (kind: SVGPatternKind) => {
        if (!Object.hasOwn(ALL, kind)) throw new Error(`SVGPatternLayouts: there is no layout named "${kind}".`);

        return ALL[kind];
    };
}
