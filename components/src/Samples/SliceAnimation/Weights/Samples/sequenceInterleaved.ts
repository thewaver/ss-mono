import { Index2dUtils, MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceInterleaved: WeightFn = (pos, count) => {
    const total = count.colCount * count.rowCount;
    const idx = Index2dUtils.toFlatIndex(pos, count.colCount);
    const pair = Math.floor(idx * 0.5);

    return SliceAnimationWeightUtils.fromOrderedIndex(MathUtils.isEven(idx) ? pair : total - 1 - pair, total);
};
