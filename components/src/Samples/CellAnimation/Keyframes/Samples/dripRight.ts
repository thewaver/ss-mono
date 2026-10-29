import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const dripRight: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 1, opacity: 0, scaleX: 400, translateX: -1600 },
    { at: 0.25, opacity: 100 },
    { at: 0.75, scaleX: 0, translateX: 0 },
    { at: 1, originX: 1, scaleX: 100, translateX: 0 },
]);
