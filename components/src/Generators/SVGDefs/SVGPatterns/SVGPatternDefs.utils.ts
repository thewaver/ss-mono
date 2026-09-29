import type { Index2d, Point2d } from "@thewaver/ss-utils";

import type { SVGPatternCell } from "./SVGPatternDefs.types";

/**
 * The arithmetic behind a repeating SVG `pattern` built from a grid of cells: which cells one tile holds, what
 * each is called and where it sits. The `pattern` element and the cells' own markup are each framework's.
 */
export namespace SVGPatternDefsUtils {
    /**
     * Lays a grid of cells out inside one tile of a pattern.
     *
     * The tile repeats across whatever it fills, so what is described here is one period of the
     * pattern rather than the whole surface. Cells are positioned by the caller rather than on a fixed
     * grid, which is what allows a brick offset, a honeycomb or a scatter.
     *
     * @param id The pattern's id, which the cells' own ids are built from, so a cell may carry gradients or
     * filters without colliding with its neighbors.
     * @param cellCount How many rows and columns one tile holds.
     * @param computeCellPos Where each cell sits within the tile, in the same user units as whatever the
     * pattern fills.
     * @returns One entry per cell, column by column and top to bottom within each, with its id, its place in
     * the grid and the `transform` that moves it into position.
     */
    export const computeCells = (
        id: string,
        cellCount: { rows: number; cols: number },
        computeCellPos: (index: Index2d) => Point2d,
    ): SVGPatternCell[] =>
        Array.from({ length: cellCount.cols }, (_, col) =>
            Array.from({ length: cellCount.rows }, (_, row) => {
                const index = { row, col };
                const pos = computeCellPos(index);

                return { id: `${id}_X${col}_Y${row}`, index, transform: `translate(${pos.x},${pos.y})` };
            }),
        ).flat();
}
