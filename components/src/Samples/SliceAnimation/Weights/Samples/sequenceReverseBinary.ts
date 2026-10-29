import { Index2dUtils, MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceReverseBinary: WeightFn = (pos, count) => {
    const total = count.col * count.row;

    if (total <= 1) return 1;

    const bits = Math.ceil(Math.log2(total));

    return SliceAnimationWeightUtils.fromOrderedIndex(
        MathUtils.reverseBits(Index2dUtils.toFlatIndex(pos, count.col), bits) % total,
        total,
    );
};
