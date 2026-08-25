import { Point2dUtils } from "@thewaver/ss-utils";

import type { WeightFn } from "../CellAnimationWeights.types";
import { CellAnimationWeightUtils } from "../CellAnimationWeights.utils";

export const frameStretchedAlternate: WeightFn = (pos, count, origin) => {
    const maxDist = CellAnimationWeightUtils.getMaxDistance(origin, count);
    const dist = Point2dUtils.getDelta(origin, pos);
    const adjustedMaxDist = Math.max(maxDist.x, maxDist.y) * 2;
    const adjustedDist = CellAnimationWeightUtils.getStretchedDistance(dist, maxDist);

    return CellAnimationWeightUtils.isEvenStretchedRing(dist, maxDist)
        ? 1 - adjustedDist / adjustedMaxDist
        : 1 - (adjustedDist / adjustedMaxDist + 0.5);
};
