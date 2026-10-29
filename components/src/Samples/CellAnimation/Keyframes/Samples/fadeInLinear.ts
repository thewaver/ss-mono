import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const fadeInLinear: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0 },
    { at: 1, opacity: 100 },
]);
