import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceLinear: WeightFn = (pos, count) =>
    CellAnimationWeightUtils.fromOrderedIndex(Index2dUtils.toFlatIndex(pos, count.col), count.col * count.row);
