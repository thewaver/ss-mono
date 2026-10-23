import { describe, expect, it } from "vitest";

import { PlacementLayoutUtils } from "../../../Generators/PlacementLayouts/PlacementLayouts.utils";
import { PlacementLayouts } from "./PlacementLayouts.const";

const MIN_ITEM_COUNT = 1;
const MAX_ITEM_COUNT = 12;

describe("PlacementLayouts.SAMPLE_LAYOUTS", () => {
    it.each(PlacementLayouts.SAMPLE_KEYS)(
        "%s gives every sector the origin the layout itself carries, at any item count",
        (key) => {
            const computeLayout = PlacementLayoutUtils.toLayoutFn(PlacementLayouts.SAMPLE_LAYOUTS[key]);

            for (let itemCount = MIN_ITEM_COUNT; itemCount <= MAX_ITEM_COUNT; itemCount++) {
                const layout = computeLayout({ itemCount });

                for (const placement of layout.placements) {
                    if (placement.sector?.origin === undefined || layout.origin === undefined) continue;

                    expect(placement.sector.origin, `${key} with ${itemCount} items`).toEqual(layout.origin);
                }
            }
        },
    );

    it("has at least one sample that carries both, so the check above is not vacuous", () => {
        const carriesBoth = PlacementLayouts.SAMPLE_KEYS.some((key) => {
            const layout = PlacementLayoutUtils.toLayoutFn(PlacementLayouts.SAMPLE_LAYOUTS[key])({ itemCount: 5 });

            return layout.origin !== undefined && layout.placements.some((placement) => placement.sector?.origin);
        });

        expect(carriesBoth).toBe(true);
    });
});
