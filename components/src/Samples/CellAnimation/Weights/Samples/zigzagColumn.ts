import { CellAnimationUtils } from "../../../../Exotics/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const zigzagColumn: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationUtils.isEvenColumn(dist)
        ? (1 - dist.row / maxDist.row + (maxDist.col - dist.col)) / (maxDist.col + 1)
        : (dist.row / maxDist.row + (maxDist.col - dist.col)) / (maxDist.col + 1);
};
