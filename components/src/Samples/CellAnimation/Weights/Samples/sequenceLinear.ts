import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceLinear: WeightFn = (pos, count) =>
    CellAnimationWeightUtils.fromOrderedIndex(
        CellAnimationWeightUtils.getRowFlatIndex(pos, count),
        count.col * count.row,
    );
