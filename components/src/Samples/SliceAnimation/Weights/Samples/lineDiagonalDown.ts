import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const lineDiagonalDown: WeightFn = (pos, count, origin) =>
    1 -
    SliceAnimationWeightUtils.getDiagonalDelta(origin, pos).down /
        SliceAnimationWeightUtils.getMaxDiagonalDistance(origin, count).down;
