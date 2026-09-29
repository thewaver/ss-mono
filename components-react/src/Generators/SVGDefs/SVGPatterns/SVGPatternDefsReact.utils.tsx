import type { ReactNode } from "react";

import { SVGPatternDefsUtils } from "@thewaver/ss-components";
import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

/** The React side of `SVGPatternDefsUtils`: a repeating SVG `pattern` built from a grid of cells. */
export namespace SVGPatternDefsReactUtils {
    /**
     * Builds a pattern whose tile holds a grid of cells.
     *
     * `SVGPatternDefsUtils.computeCells` places the cells; each is drawn by the caller inside a group moved to its
     * position and keyed by the cell's own id.
     *
     * @param id The pattern's id, which the cells' own ids are built from.
     * @param cellCount How many rows and columns one tile holds.
     * @param patternSize The tile's size, in the same user units as whatever the pattern fills.
     * @param computeCellPos Where each cell sits within the tile.
     * @param renderCell Draws one cell. Receives an id of its own, so a cell may carry gradients or filters without
     * colliding with its neighbors, along with its position in the grid and the grid's size.
     * @returns The `pattern` element, which a fill points at with `url(#…)`.
     */
    export const computePattern = (
        id: string,
        cellCount: { rows: number; cols: number },
        patternSize: Size2d,
        computeCellPos: (index: Index2d) => Point2d,
        renderCell: (id: string, index: Index2d, cellCount: { rows: number; cols: number }) => ReactNode,
    ) => (
        <pattern id={id} width={patternSize.width} height={patternSize.height} patternUnits="userSpaceOnUse">
            {SVGPatternDefsUtils.computeCells(id, cellCount, computeCellPos).map((cell) => (
                <g key={cell.id} transform={cell.transform}>
                    {renderCell(cell.id, cell.index, cellCount)}
                </g>
            ))}
        </pattern>
    );
}
