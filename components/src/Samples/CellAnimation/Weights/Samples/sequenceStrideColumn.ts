import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceStrideColumn: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.stride(
        CellAnimationWeightUtils.getColumnFlatIndex(pos, count),
        CellAnimationWeightUtils.getColumnFlatIndex(CellAnimationWeightUtils.getRoundedPos(origin), count),
        count.col * count.row,
    );
