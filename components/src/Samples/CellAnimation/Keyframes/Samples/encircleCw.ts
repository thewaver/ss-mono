import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";

export const encircleCw: SliceAnimationFn = SliceAnimationKeyframeUtils.fromStops([
    { at: 0, originX: 0, originY: 0, scaleX: 0, scaleY: 0 },
    { at: 1 / 3, originX: 1, originY: 0 },
    { at: 2 / 3, originX: 1, originY: 1 },
    { at: 1, originX: 0, originY: 1, scaleX: 100, scaleY: 100 },
]);
