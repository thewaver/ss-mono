import { PlacementLayoutDefaults } from "./PlacementLayouts.const";
import { NOTHING, toFittedLayout } from "./PlacementLayouts.internal";
import type { FittedLayoutFn, ZigzagDefs } from "./PlacementLayouts.types";

/** The zigzag layout family, alone, so code that uses only this one pays for nothing else. */
export namespace PlacementZigzagUtils {
    /**
     * Walks items down the box, turning back on itself every few steps.
     *
     * @param defs How many items make up one leg before it turns.
     * @returns A layout function, fitted — it fills whatever room it is given.
     */
    export const createZigzag = (defs?: ZigzagDefs): FittedLayoutFn => {
        const segmentLength = defs?.segmentLength ?? PlacementLayoutDefaults.ZIGZAG_DEFAULTS.segmentLength;
        const step = 1 / (1 + segmentLength);
        const peak = segmentLength - 1;

        return ({ itemCount }) => ({
            ...toFittedLayout(
                Array.from({ length: itemCount }, (_unused, index) => ({
                    topShare: step * (index + 1),
                    leftShare: step * ((peak > NOTHING ? peak - Math.abs((index % (peak * 2)) - peak) : NOTHING) + 1),
                    widthShare: step * 2,
                    heightShare: step * 2,
                })),
            ),
            spreadRule: "circular",
        });
    };
}
