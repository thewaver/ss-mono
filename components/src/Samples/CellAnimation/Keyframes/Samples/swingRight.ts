import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const swingRight: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 1, opacity: 0, rotate: 75 },
    { at: 0.2, opacity: 100 },
    { at: 0.4, rotate: -40 },
    { at: 0.6, rotate: 20 },
    { at: 0.8, rotate: -8 },
    { at: 0.9, rotate: 3 },
    { at: 1, originX: 1, rotate: 0 },
]);
