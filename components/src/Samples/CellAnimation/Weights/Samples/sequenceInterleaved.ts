import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceInterleaved: WeightFn = (pos, count) => {
    const total = count.col * count.row;
    const idx = CellAnimationWeightUtils.getRowFlatIndex(pos, count);
    const pair = Math.floor(idx * 0.5);

    return CellAnimationWeightUtils.fromOrderedIndex(MathUtils.isEven(idx) ? pair : total - 1 - pair, total);
};
