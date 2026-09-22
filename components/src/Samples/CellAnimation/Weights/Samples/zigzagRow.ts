import { CellAnimationUtils } from "../../../../Exotics/CellAnimation/CellAnimation.utils";
import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const zigzagRow: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return CellAnimationUtils.isEvenRow(dist)
        ? (1 - dist.col / maxDist.col + (maxDist.row - dist.row)) / (maxDist.row + 1)
        : (dist.col / maxDist.col + (maxDist.row - dist.row)) / (maxDist.row + 1);
};
