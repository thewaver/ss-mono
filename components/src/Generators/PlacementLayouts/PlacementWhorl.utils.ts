import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import { computeWhorl, toFittedLayout } from "./PlacementLayouts.internal";
import type { FittedLayoutFn, WhorlDefs } from "./PlacementLayouts.types";

/** The whorl layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementWhorlUtils {
    /**
     * Turns items about each other in threes, each group set below the one before it.
     *
     * The three whorls in the registry are this factory at three spacings, and they stay three entries
     * because a whorl is read against the shape put into it — a circle, a hexagon and a square each want
     * different spacing, so the second entry shows something the first does not.
     *
     * @param defs How far an item steps within its group, and how far a group steps from the last.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createWhorl = (defs?: WhorlDefs): FittedLayoutFn => {
        const itemStepRatio = defs?.itemStepRatio ?? PlacementLayoutDefaults.WHORL_DEFAULTS.itemStepRatio;
        const whorlStepRatio = defs?.whorlStepRatio ?? PlacementLayoutDefaults.WHORL_DEFAULTS.whorlStepRatio;

        return ({ itemCount }) => ({
            ...toFittedLayout(computeWhorl(itemCount, itemStepRatio, whorlStepRatio)),
            spreadRule: "circular",
        });
    };
}
