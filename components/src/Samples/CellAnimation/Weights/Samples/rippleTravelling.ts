import { Point2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

const RIPPLE_PERIOD_CELLS = 4;
const TRAVELLING_RIPPLE = 0.5;

export const rippleTravelling: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = Point2dUtils.getDelta(origin, pos);

    return CellAnimationWeightUtils.ripple(
        Point2dUtils.getLength(dist),
        Point2dUtils.getLength(maxDist),
        RIPPLE_PERIOD_CELLS,
        TRAVELLING_RIPPLE,
    );
};
