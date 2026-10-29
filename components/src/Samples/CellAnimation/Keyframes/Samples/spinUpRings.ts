import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { spinUpCcw } from "./spinUpCcw";
import { spinUpCw } from "./spinUpCw";

export const spinUpRings: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_rings", animation: spinUpCw }],
    spinUpCcw,
);
