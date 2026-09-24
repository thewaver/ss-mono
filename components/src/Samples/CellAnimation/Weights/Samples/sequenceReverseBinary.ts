import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceReverseBinary: WeightFn = (pos, count) => {
    const total = count.col * count.row;

    if (total <= 1) return 1;

    const bits = Math.ceil(Math.log2(total));

    return CellAnimationWeightUtils.fromOrderedIndex(
        MathUtils.reverseBits(CellAnimationWeightUtils.getRowFlatIndex(pos, count), bits) % total,
        total,
    );
};
