import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { skewCcw } from "./skewCcw";
import { skewCw } from "./skewCw";

export const skewCheckered: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_checkered_cells", animation: skewCw }],
    skewCcw,
);
