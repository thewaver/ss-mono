import { Point2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 4;
const TRAVELLING_RIPPLE = 0.5;

export const rippleDiamondTravelling: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = Point2dUtils.getDelta(origin, pos);

    return CellAnimationWeightUtils.ripple(
        (dist.x + dist.y) * 0.5,
        (maxDist.x + maxDist.y) * 0.5,
        RIPPLE_PERIOD_CELLS,
        TRAVELLING_RIPPLE,
    );
};
