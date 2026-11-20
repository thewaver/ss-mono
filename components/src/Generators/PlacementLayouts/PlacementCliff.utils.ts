import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import {
    CLIFF_CENTER,
    CLIFF_DROP_RATIOS,
    CLIFF_SHIFT_RATIOS,
    CLIFF_SIZE,
    HALF,
    ITEM_QUARTERS,
    QUARTER,
    toFittedLayout,
} from "./PlacementLayouts.internal";
import type { CliffDefs, FittedLayoutFn } from "./PlacementLayouts.types";

/** The cliff layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementCliffUtils {
    /**
     * Steps items down and across in threes, like a stack of cards dealt down a slope.
     *
     * @param defs How far each group of three drops below the one before it.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createCliff = (defs?: CliffDefs): FittedLayoutFn => {
        const cliffStepRatio = defs?.cliffStepRatio ?? PlacementLayoutDefaults.CLIFF_DEFAULTS.cliffStepRatio;
        const itemSize = QUARTER * ITEM_QUARTERS;
        const leaderLeft =
            CLIFF_CENTER - itemSize * ((Math.min(...CLIFF_SHIFT_RATIOS) + Math.max(...CLIFF_SHIFT_RATIOS)) * HALF);

        return ({ itemCount }) => ({
            ...toFittedLayout(
                Array.from({ length: itemCount }, (_unused, index) => {
                    const place = index % CLIFF_SIZE;

                    return {
                        topShare:
                            itemSize * HALF +
                            itemSize * (Math.floor(index / CLIFF_SIZE) * cliffStepRatio + CLIFF_DROP_RATIOS[place]),
                        leftShare: leaderLeft + itemSize * CLIFF_SHIFT_RATIOS[place],
                        widthShare: itemSize,
                        heightShare: itemSize,
                    };
                }),
            ),
            spreadRule: "circular",
        });
    };
}
