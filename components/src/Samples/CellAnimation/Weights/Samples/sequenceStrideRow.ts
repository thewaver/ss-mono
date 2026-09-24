import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceStrideRow: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.stride(
        CellAnimationWeightUtils.getRowFlatIndex(pos, count),
        CellAnimationWeightUtils.getRowFlatIndex(CellAnimationWeightUtils.getRoundedPos(origin), count),
        count.col * count.row,
    );
