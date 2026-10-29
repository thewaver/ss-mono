import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceStrideRow: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.stride(
        Index2dUtils.toFlatIndex(pos, count.col),
        Index2dUtils.toFlatIndex(SliceAnimationWeightUtils.getRoundedPos(origin), count.col),
        count.col * count.row,
    );
