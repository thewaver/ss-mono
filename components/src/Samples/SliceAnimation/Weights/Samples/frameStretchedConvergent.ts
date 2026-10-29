import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const frameStretchedConvergent: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);
    const adjustedMaxDist = Math.max(maxDist.col, maxDist.row) * 2;
    const adjustedDist = SliceAnimationWeightUtils.getStretchedDistance(dist, maxDist);

    return SliceAnimationWeightUtils.isEvenStretchedRing(dist, maxDist)
        ? 1 - adjustedDist / adjustedMaxDist
        : 1 - (adjustedMaxDist + 1 - adjustedDist) / adjustedMaxDist;
};
