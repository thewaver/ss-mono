import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const sequenceStrideColumn: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.stride(
        CellAnimationWeightUtils.getColumnFlatIndex(pos, count),
        CellAnimationWeightUtils.getColumnFlatIndex(CellAnimationWeightUtils.getRoundedPos(origin), count),
        count.x * count.y,
    );
