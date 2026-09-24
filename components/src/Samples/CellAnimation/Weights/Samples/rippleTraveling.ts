import type { RippleDefs, WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 4;
const TRAVELING_RIPPLE = 0.5;

const RIPPLE_DEFS: RippleDefs = {
    periodCells: RIPPLE_PERIOD_CELLS,
    travelRatio: TRAVELING_RIPPLE,
};

export const rippleTraveling: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationWeightUtils.ripple(
        CellAnimationWeightUtils.getCellDistance(dist),
        CellAnimationWeightUtils.getCellDistance(maxDist),
        RIPPLE_DEFS,
    );
};
