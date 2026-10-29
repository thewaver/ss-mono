import { CellAnimationUtils } from "../../../../Exotics/Animations/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const lineRowConvergent: WeightFn = (pos, count, origin) => {
    const maxDist = SliceAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = SliceAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationUtils.isEvenRow(dist)
        ? 1 - dist.row / (maxDist.row * 2)
        : 1 - ((maxDist.row + 1 - dist.row) / (maxDist.row * 2) + 0.5);
};
