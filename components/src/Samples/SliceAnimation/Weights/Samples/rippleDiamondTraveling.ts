import type { RippleDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 4;
const TRAVELING_RIPPLE = 0.5;

const RIPPLE_DEFS: RippleDefs = {
    periodCells: RIPPLE_PERIOD_CELLS,
    travelRatio: TRAVELING_RIPPLE,
};

export const rippleDiamondTraveling: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);

    return SliceAnimationWeightUtils.ripple(
        (dist.col + dist.row) * 0.5,
        (maxDist.col + maxDist.row) * 0.5,
        RIPPLE_DEFS,
    );
};
