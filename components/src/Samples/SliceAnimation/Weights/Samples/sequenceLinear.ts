import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceLinear: WeightFn = (pos, count) =>
    SliceAnimationWeightUtils.fromOrderedIndex(Index2dUtils.toFlatIndex(pos, count.col), count.col * count.row);
