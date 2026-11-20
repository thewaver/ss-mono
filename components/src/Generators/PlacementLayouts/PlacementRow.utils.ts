import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import { FULL_SHARE, SINGLE_ITEM, toFittedLayout, toRun } from "./PlacementLayouts.internal";
import type { FittedLayoutFn, RowDefs } from "./PlacementLayouts.types";

/** The row layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementRowUtils {
    /**
     * Places items in a line across the box, filling its width.
     *
     * The arrangement a control would have had without a layout at all, which is what it is here for: it
     * is the shape where the right answer is obvious by eye, so an effect or a walk that is wrong in it is
     * plainly wrong. It declares that it runs horizontally, so an item giving way to a growing neighbor
     * moves sideways and nowhere else.
     *
     * @param defs The gap between items, as a share of an item's width, and how tall an item is against it.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createRow = (defs?: RowDefs): FittedLayoutFn => {
        const gapRatio = defs?.gapRatio ?? PlacementLayoutDefaults.ROW_DEFAULTS.gapRatio;
        const itemHeightRatio = defs?.itemHeightRatio ?? PlacementLayoutDefaults.ROW_DEFAULTS.itemHeightRatio;

        return ({ itemCount }) => {
            const spans = Math.max(itemCount + (itemCount - SINGLE_ITEM) * gapRatio, SINGLE_ITEM);
            const width = FULL_SHARE / spans;

            return {
                ...toFittedLayout(toRun(itemCount, { x: width, y: width * itemHeightRatio }, width * gapRatio, false)),
                reachRule: "horizontal",
            };
        };
    };
}
