import { CellAnimationUtils } from "../../../../Exotics/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const diamondAlternate: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);
    const adjustedMaxDist = Math.max(maxDist.col, maxDist.row) * 2;
    const adjustedDist = (dist.col + dist.row) * 0.5;

    return CellAnimationUtils.isEvenRing(dist)
        ? 1 - adjustedDist / adjustedMaxDist
        : 1 - (adjustedDist / adjustedMaxDist + 0.5);
};
