import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";

export const hopDown: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, translateY: -400, translateX: 0, scaleX: 20, scaleY: 20 },
    { at: 0.25, opacity: 100, translateY: -300, translateX: -200, scaleX: 40, scaleY: 40 },
    { at: 0.5, translateY: -200, translateX: 0, scaleX: 60, scaleY: 60 },
    { at: 0.75, translateY: -100, translateX: -100, scaleX: 80, scaleY: 80 },
    { at: 1, translateY: 0, translateX: 0, scaleX: 100, scaleY: 100 },
]);
