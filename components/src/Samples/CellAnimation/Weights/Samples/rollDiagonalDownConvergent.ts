import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const rollDiagonalDownConvergent: WeightFn = (pos, count, origin) => {
    const dist = CellAnimationWeightUtils.getDiagonalDelta(origin, pos);
    const bandMax = CellAnimationWeightUtils.getMaxDiagonalDistanceInBand(origin, count, dist);

    return MathUtils.isEven(dist.down) ? 1 - dist.up / (bandMax.up * 2) : dist.up / (bandMax.up * 2);
};
