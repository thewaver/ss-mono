import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";

export const fadeInFlash: CellAnimationFn = CellAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, saturate: 50, brightness: 200 },
    { at: 0.5, opacity: 100, saturate: 50, brightness: 200 },
    { at: 1, saturate: 100, brightness: 100 },
]);
