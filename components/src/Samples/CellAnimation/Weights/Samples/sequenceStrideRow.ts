import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceStrideRow: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.stride(
        Index2dUtils.toFlatIndex(pos, count.col),
        Index2dUtils.toFlatIndex(CellAnimationWeightUtils.getRoundedPos(origin), count.col),
        count.col * count.row,
    );
