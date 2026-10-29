import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const lineRow: WeightFn = (pos, count, origin) =>
    1 -
    SliceAnimationWeightUtils.getCellDelta(origin, pos).row /
        SliceAnimationWeightUtils.getMaxDistance(origin, count).row;
