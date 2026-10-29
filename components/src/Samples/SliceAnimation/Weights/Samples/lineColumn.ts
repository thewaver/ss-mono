import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const lineColumn: WeightFn = (pos, count, origin) =>
    1 -
    SliceAnimationWeightUtils.getCellDelta(origin, pos).col /
        SliceAnimationWeightUtils.getMaxDistance(origin, count).col;
