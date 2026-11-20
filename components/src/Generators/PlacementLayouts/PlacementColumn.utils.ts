import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import { FULL_SHARE, toFittedLayout, toRun } from "./PlacementLayouts.internal";
import type { ColumnDefs, FittedLayoutFn } from "./PlacementLayouts.types";

/** The column layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementColumnUtils {
    /**
     * Places items in a line down the box.
     *
     * A row read down rather than across: its items fill the box's width, as a row's fill its width, so a narrow
     * column is a narrow box — the consumer sets the width on whatever holds it, and the column grows as tall as its
     * items come to. Its items give way vertically.
     *
     * @param defs How tall an item is against its own width, and the gap between.
     * @returns A layout function, fitted — its height is whatever the items come to.
     */
    export const createColumn = (defs?: ColumnDefs): FittedLayoutFn => {
        const gapRatio = defs?.gapRatio ?? PlacementLayoutDefaults.COLUMN_DEFAULTS.gapRatio;
        const itemHeightRatio = defs?.itemHeightRatio ?? PlacementLayoutDefaults.COLUMN_DEFAULTS.itemHeightRatio;

        return ({ itemCount }) => ({
            ...toFittedLayout(
                toRun(itemCount, { x: FULL_SHARE, y: itemHeightRatio }, itemHeightRatio * gapRatio, true),
            ),
            reachRule: "vertical",
        });
    };
}
