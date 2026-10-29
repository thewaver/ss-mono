import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { spinDownCcw } from "./spinDownCcw";
import { spinDownCw } from "./spinDownCw";

export const spinDownCheckered: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_checkered_cells", animation: spinDownCw }],
    spinDownCcw,
);
