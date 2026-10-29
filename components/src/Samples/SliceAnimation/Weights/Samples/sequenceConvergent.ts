import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceConvergent: WeightFn = (pos, count) => {
    const total = count.col * count.row;
    const idx = Index2dUtils.toFlatIndex(pos, count.col);
    const progress = total <= 1 ? 0.5 : idx / (total - 1);
    const edgeDistance = Math.abs(progress - 0.5) * 2;

    return SliceAnimationWeightUtils.fromOrderedIndex(Math.round((1 - edgeDistance) * (total - 1)), total);
};
