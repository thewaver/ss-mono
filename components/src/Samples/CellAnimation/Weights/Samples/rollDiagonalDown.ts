import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../../../../Generators/CellAnimationWeights/CellAnimationWeights.utils";

export const rollDiagonalDown: WeightFn = (pos, count, origin) => {
    const dist = CellAnimationWeightUtils.getDiagonalDelta(origin, pos);
    const bandMax = CellAnimationWeightUtils.getMaxDiagonalDistanceInBand(origin, count, dist);

    return MathUtils.isEven(dist.down) ? 1 - dist.up / (bandMax.up * 2) : 1 - (dist.up / (bandMax.up * 2) + 0.5);
};
