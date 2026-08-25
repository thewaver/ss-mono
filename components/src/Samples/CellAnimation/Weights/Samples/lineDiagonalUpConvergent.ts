import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const lineDiagonalUpConvergent: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDiagonalDistance(origin, count);
    const dist = CellAnimationWeightUtils.getDiagonalDelta(origin, pos);

    return MathUtils.isEven(dist.up)
        ? 1 - dist.up / (maxDist.up * 2)
        : 1 - ((maxDist.up + 1 - dist.up) / (maxDist.up * 2) + 0.5);
};
