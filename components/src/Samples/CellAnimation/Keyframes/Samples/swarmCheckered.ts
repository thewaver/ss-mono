import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { swarmCcw } from "./swarmCcw";
import { swarmCw } from "./swarmCw";

export const swarmCheckered: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [{ zone: "even_checkered_cells", animation: swarmCw }],
    swarmCcw,
);
