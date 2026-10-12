import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { swarmCcw } from "./swarmCcw";
import { swarmCw } from "./swarmCw";

export const swarmCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "even_checkered_cells", animation: swarmCw }],
    swarmCcw,
);
