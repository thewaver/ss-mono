import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const flipVertical: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, opacity: 0, rotateX: 180 },
    { at: 0.2, opacity: 100 },
    { at: 1, rotateX: 0 },
]);
