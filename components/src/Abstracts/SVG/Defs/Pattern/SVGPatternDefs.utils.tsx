import type { JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

/** Builds a repeating SVG `pattern` from a grid of cells. */
export namespace SVGPatternDefsUtils {
    /**
     * Lays a grid of cells out inside one tile of a pattern.
     *
     * The tile repeats across whatever it fills, so what is described here is one period of the
     * pattern rather than the whole surface. Cells are positioned by the caller rather than on a fixed
     * grid, which is what allows a brick offset, a honeycomb or a scatter.
     *
     * @param id The pattern's id, which the cells' own ids are built from.
     * @param cellCount How many rows and columns one tile holds.
     * @param patternSize The tile's size, in the same user units as whatever the pattern fills.
     * @param computeCellPos Where each cell sits within the tile.
     * @param renderCell Draws one cell. Receives an id of its own, so a cell may carry gradients or
     * filters without colliding with its neighbours, along with its position in the grid and the grid's
     * size.
     */
    export const computePattern = (
        id: string,
        cellCount: { rows: number; cols: number },
        patternSize: Size2d,
        computeCellPos: (index: { row: number; col: number }) => Point2d,
        renderCell: (
            id: string,
            index: { row: number; col: number },
            cellCount: { rows: number; cols: number },
        ) => JSX.Element,
    ) => {
        return (
            <pattern id={id} width={patternSize.width} height={patternSize.height} patternUnits="userSpaceOnUse">
                {Array.from({ length: cellCount.cols }, (_, col) =>
                    Array.from({ length: cellCount.rows }, (_, row) => {
                        const index = { row, col };
                        const pos = computeCellPos(index);
                        const cellId = `${id}_X${col}_Y${row}`;

                        return <g transform={`translate(${pos.x},${pos.y})`}>{renderCell(cellId, index, cellCount)}</g>;
                    }),
                )}
            </pattern>
        );
    };
}
