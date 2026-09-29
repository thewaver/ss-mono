import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";
import type { SvelteMarkup } from "../../../Utils/typeUtils.js";
export type SVGPatternProps = {
    /** The pattern's id, which the cells' own ids are built from. */
    id: string;
    /** How many rows and columns one tile holds. */
    cellCount: {
        rows: number;
        cols: number;
    };
    /** The tile's size, in the same user units as whatever the pattern fills. */
    patternSize: Size2d;
    /** Where each cell sits within the tile. */
    computeCellPos: (index: Index2d) => Point2d;
    /**
     * Draws one cell. Receives an id of its own, so a cell may carry gradients or filters without colliding with its
     * neighbors, along with its position in the grid and the grid's size.
     */
    renderCell: (id: string, index: Index2d, cellCount: {
        rows: number;
        cols: number;
    }) => SvelteMarkup;
};
