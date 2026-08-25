import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";

export const shootRight: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, translateX: -800, scaleX: 100, scaleY: 100 },
    { at: 0.25, opacity: 100 },
    { at: 0.66, translateX: 400, scaleX: 150, scaleY: 150 },
    { at: 1, translateX: 0, scaleX: 100, scaleY: 100 },
]);
