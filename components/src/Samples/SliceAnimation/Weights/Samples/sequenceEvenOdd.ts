import { Index2dUtils, MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceEvenOdd: WeightFn = (pos, count) => {
    const total = count.col * count.row;
    const idx = Index2dUtils.toFlatIndex(pos, count.col);
    const evenCount = Math.ceil(total * 0.5);

    return SliceAnimationWeightUtils.fromOrderedIndex(
        MathUtils.isEven(idx) ? idx * 0.5 : evenCount + Math.floor(idx * 0.5),
        total,
    );
};
