import { Index2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const sequenceStrideColumn: WeightFn = (pos, count, origin) =>
    CellAnimationWeightUtils.stride(
        Index2dUtils.toFlatIndexByColumn(pos, count.row),
        Index2dUtils.toFlatIndexByColumn(CellAnimationWeightUtils.getRoundedPos(origin), count.row),
        count.col * count.row,
    );
