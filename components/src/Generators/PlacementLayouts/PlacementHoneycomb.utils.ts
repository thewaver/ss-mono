import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";
import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import {
    CELL_WIDTH,
    EVEN_ROW,
    HALF,
    HEX_CLIP_PATH,
    HEX_HEIGHT_RATIO,
    HEX_ROW_STEP_RATIO,
    NOTHING,
    NO_ITEMS,
    ROW_PARITY,
    SINGLE_ITEM,
} from "./PlacementLayouts.internal";
import type { HoneycombDefs, SizedLayout, SizedLayoutFn } from "./PlacementLayouts.types";

/** The honeycomb layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementHoneycombUtils {
    /**
     * Packs items into staggered rows of hexagonal cells.
     *
     * Every cell carries the clip path that makes it a hexagon, so a consumer gets the shape without
     * drawing it. Rows alternate by half a cell, which is what makes the packing tighter than a grid.
     *
     * @param defs How many cells to a row, and the gap between them as a share of a cell.
     * @returns A layout function, sized — it states the width it was drawn at.
     */
    export const createHoneycomb = (defs?: HoneycombDefs): SizedLayoutFn => {
        const cellWidth = CELL_WIDTH;
        const perRow = Math.max(defs?.perRow ?? PlacementLayoutDefaults.HONEYCOMB_DEFAULTS.perRow, SINGLE_ITEM);
        const gap = (defs?.gapRatio ?? PlacementLayoutDefaults.HONEYCOMB_DEFAULTS.gapRatio) * cellWidth;

        return ({ itemCount }): SizedLayout => {
            if (itemCount <= NO_ITEMS) {
                return {
                    placements: [],
                    extent: NOTHING,
                    heightRatio: NOTHING,
                    pickRule: "nearest",
                    spreadRule: "cartesian",
                };
            }

            const cellHeight = cellWidth * HEX_HEIGHT_RATIO;
            const columnStep = cellWidth + gap;
            const rowStep = cellHeight * HEX_ROW_STEP_RATIO + gap;
            const rowCount = Math.max(Math.ceil(itemCount / perRow), SINGLE_ITEM);
            const columnCount = Math.min(itemCount, perRow);
            const hasStaggeredRow = rowCount > SINGLE_ITEM;
            const width = columnStep * columnCount + (hasStaggeredRow ? columnStep * HALF : NOTHING);
            const height = rowStep * (rowCount - SINGLE_ITEM) + cellHeight;

            const placements = Array.from({ length: itemCount }, (_unused, index): PlacementRect => {
                const row = Math.floor(index / perRow);
                const stagger = row % ROW_PARITY === EVEN_ROW ? NOTHING : columnStep * HALF;

                return {
                    leftShare: (stagger + columnStep * (index % perRow) + cellWidth * HALF) / width,
                    topShare: (rowStep * row + cellHeight * HALF) / width,
                    widthShare: cellWidth / width,
                    heightShare: cellHeight / width,
                    clipPath: HEX_CLIP_PATH,
                };
            });

            return {
                placements,
                extent: width,
                heightRatio: height / width,
                pickRule: "nearest",
                spreadRule: "cartesian",
            };
        };
    };
}
