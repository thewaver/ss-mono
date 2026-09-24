import { CellAnimationUtils } from "../../../../Exotics/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const entwineRow: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationUtils.isEvenRow(dist) ? 1 - dist.col / maxDist.col : dist.col / maxDist.col;
};
