import { MathUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const lineDiagonalDownConvergent: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDiagonalDistance(origin, count);
    const dist = CellAnimationWeightUtils.getDiagonalDelta(origin, pos);

    return MathUtils.isEven(dist.down)
        ? 1 - dist.down / (maxDist.down * 2)
        : 1 - ((maxDist.down + 1 - dist.down) / (maxDist.down * 2) + 0.5);
};
