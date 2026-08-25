import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";

export const skewCw: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, skewX: -75, skewY: -75, scaleX: 0, scaleY: 0 },
    { at: 1, skewX: 0, skewY: 0, scaleX: 100, scaleY: 100 },
]);
