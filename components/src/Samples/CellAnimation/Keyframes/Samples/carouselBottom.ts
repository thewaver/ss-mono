import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const carouselBottom: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originY: 1, opacity: 0, rotateX: -90, depth: 240 },
    { at: 0.25, opacity: 100 },
    { at: 1, originY: 1, rotateX: 0, depth: 0 },
]);
