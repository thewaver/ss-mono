import { CellAnimationUtils } from "../../../../Exotics/Animations/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const radialAlternate: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);
    const adjustedMaxDist = SliceAnimationWeightUtils.getCellDistance(maxDist) * 2;
    const adjustedDist = SliceAnimationWeightUtils.getCellDistance(dist);

    return CellAnimationUtils.isEvenRing(dist)
        ? 1 - adjustedDist / adjustedMaxDist
        : 1 - (adjustedDist / adjustedMaxDist + 0.5);
};
