import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const sequenceStrideRow: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.stride(
        CellAnimationWeightUtils.getRowFlatIndex(pos, count),
        CellAnimationWeightUtils.getRowFlatIndex(CellAnimationWeightUtils.getRoundedPos(origin), count),
        count.x * count.y,
    );
