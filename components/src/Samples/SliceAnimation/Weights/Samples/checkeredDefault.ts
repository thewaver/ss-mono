import { CellAnimationUtils } from "../../../../Exotics/Animations/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const checkeredDefault: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);
    const adjustedMaxDist = Math.max(maxDist.col, maxDist.row) * 2;
    const adjustedDist = Math.max(dist.col, dist.row);

    return CellAnimationUtils.isEvenCheckered(dist)
        ? 1 - adjustedDist / adjustedMaxDist
        : 1 - (adjustedDist / adjustedMaxDist + 0.5);
};
