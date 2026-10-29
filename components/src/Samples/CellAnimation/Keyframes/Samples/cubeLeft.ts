import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const cubeLeft: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 0, opacity: 0, rotateY: 180 },
    { at: 0.2, opacity: 100 },
    { at: 1, originX: 0, rotateY: 0 },
]);
