import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const frameStretchedConvergent: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);
    const adjustedMaxDist = Math.max(maxDist.col, maxDist.row) * 2;
    const adjustedDist = CellAnimationWeightUtils.getStretchedDistance(dist, maxDist);

    return CellAnimationWeightUtils.isEvenStretchedRing(dist, maxDist)
        ? 1 - adjustedDist / adjustedMaxDist
        : 1 - (adjustedMaxDist + 1 - adjustedDist) / adjustedMaxDist;
};
