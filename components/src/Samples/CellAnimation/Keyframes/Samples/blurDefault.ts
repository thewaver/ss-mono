import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const blurDefault: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, blur: 20 },
    { at: 0.5, opacity: 100 },
    { at: 1, blur: 0 },
]);
