import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceEvenOdd: WeightFn = (pos, count) => {
    const total = count.col * count.row;
    const idx = CellAnimationWeightUtils.getRowFlatIndex(pos, count);
    const evenCount = Math.ceil(total * 0.5);

    return CellAnimationWeightUtils.fromOrderedIndex(
        MathUtils.isEven(idx) ? idx * 0.5 : evenCount + Math.floor(idx * 0.5),
        total,
    );
};
