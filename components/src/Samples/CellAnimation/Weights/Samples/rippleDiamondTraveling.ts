import type { RippleDefs, WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 4;
const TRAVELING_RIPPLE = 0.5;

const RIPPLE_DEFS: RippleDefs = {
    periodCells: RIPPLE_PERIOD_CELLS,
    travelRatio: TRAVELING_RIPPLE,
};

export const rippleDiamondTraveling: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationWeightUtils.ripple((dist.col + dist.row) * 0.5, (maxDist.col + maxDist.row) * 0.5, RIPPLE_DEFS);
};
