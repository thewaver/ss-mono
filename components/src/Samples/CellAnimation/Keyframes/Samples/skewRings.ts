import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { skewCcw } from "./skewCcw";
import { skewCw } from "./skewCw";

export const skewRings: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_rings", animation: skewCw }],
    skewCcw,
);
