import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.types";
import { SliceAnimationWeightUtils } from "../../../../Generators/SliceAnimationWeights/SliceAnimationWeights.utils";

export const sequenceStrideColumn: WeightFn = (pos, count, origin) =>
    SliceAnimationWeightUtils.stride(
        Index2dUtils.toFlatIndexByColumn(pos, count.row),
        Index2dUtils.toFlatIndexByColumn(SliceAnimationWeightUtils.getRoundedPos(origin), count.row),
        count.col * count.row,
    );
