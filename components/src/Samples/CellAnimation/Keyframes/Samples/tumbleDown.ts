import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";

export const tumbleDown: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, translateY: -200, translateX: 0, rotate: -180 },
    { at: 0.25, opacity: 100, translateY: -150, translateX: 50, rotate: -135 },
    { at: 0.5, translateY: -100, translateX: 0, rotate: -90 },
    { at: 0.75, translateY: -50, translateX: 25, rotate: -45 },
    { at: 1, translateY: 0, translateX: 0, rotate: 0 },
]);
