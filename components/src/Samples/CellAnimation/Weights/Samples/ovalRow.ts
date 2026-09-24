import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const ovalRow: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = CellAnimationWeightUtils.getCellDelta(origin, pos);

    return (1 - dist.col / maxDist.col + (maxDist.row - dist.row)) / (maxDist.row + 1);
};
