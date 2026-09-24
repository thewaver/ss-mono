import { CellAnimationUtils } from "../../../../Exotics/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const lineRowConvergent: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationUtils.isEvenRow(dist)
        ? 1 - dist.row / (maxDist.row * 2)
        : 1 - ((maxDist.row + 1 - dist.row) / (maxDist.row * 2) + 0.5);
};
