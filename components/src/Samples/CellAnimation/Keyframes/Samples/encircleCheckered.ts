import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { encircleCcw } from "./encircleCcw";
import { encircleCw } from "./encircleCw";

export const encircleCheckered: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_checkered_cells", animation: encircleCw }],
    encircleCcw,
);
