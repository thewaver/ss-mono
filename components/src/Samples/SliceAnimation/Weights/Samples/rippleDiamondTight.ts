import type { RippleDefs, WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 2;
const STANDING_RIPPLE = 0;

const RIPPLE_DEFS: RippleDefs = {
    periodCells: RIPPLE_PERIOD_CELLS,
    travelRatio: STANDING_RIPPLE,
};

export const rippleDiamondTight: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);

    return SliceAnimationWeightUtils.ripple(
        (dist.col + dist.row) * 0.5,
        (maxDist.col + maxDist.row) * 0.5,
        RIPPLE_DEFS,
    );
};
