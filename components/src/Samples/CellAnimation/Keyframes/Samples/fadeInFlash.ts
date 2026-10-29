import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const fadeInFlash: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, saturate: 50, brightness: 200 },
    { at: 0.5, opacity: 100, saturate: 50, brightness: 200 },
    { at: 1, saturate: 100, brightness: 100 },
]);
