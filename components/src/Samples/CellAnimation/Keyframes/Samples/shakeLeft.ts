import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";

export const shakeLeft: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, translateY: -100, translateX: 800, rotate: 20 },
    { at: 0.25, opacity: 100, translateY: 100, translateX: 600, rotate: -20 },
    { at: 0.5, translateY: -50, translateX: 400, rotate: 10 },
    { at: 0.75, translateY: 50, translateX: 200, rotate: -10 },
    { at: 1, translateY: 0, translateX: 0, rotate: 0 },
]);
