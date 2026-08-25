import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";

export const dripLeft: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 0, opacity: 0, scaleX: 400, translateX: 1600 },
    { at: 0.25, opacity: 100 },
    { at: 0.75, scaleX: 0, translateX: 0 },
    { at: 1, originX: 0, scaleX: 100, translateX: 0 },
]);
