import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceConvergent: WeightFn = (pos, count) => {
    const total = count.col * count.row;
    const idx = CellAnimationWeightUtils.getRowFlatIndex(pos, count);
    const progress = total <= 1 ? 0.5 : idx / (total - 1);
    const edgeDistance = Math.abs(progress - 0.5) * 2;

    return CellAnimationWeightUtils.fromOrderedIndex(Math.round((1 - edgeDistance) * (total - 1)), total);
};
