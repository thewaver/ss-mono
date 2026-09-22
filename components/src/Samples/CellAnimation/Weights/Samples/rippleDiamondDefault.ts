import type { RippleDefs, WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 4;
const STANDING_RIPPLE = 0;

const RIPPLE_DEFS: RippleDefs = {
    periodCells: RIPPLE_PERIOD_CELLS,
    travelRatio: STANDING_RIPPLE,
};

export const rippleDiamondDefault: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationWeightUtils.ripple((dist.col + dist.row) * 0.5, (maxDist.col + maxDist.row) * 0.5, RIPPLE_DEFS);
};
