import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const diamondDefault: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);

    return 1 - ((dist.col + dist.row) * 0.5) / Math.max(maxDist.col, maxDist.row);
};
