import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { swarmCcw } from "./swarmCcw";
import { swarmCw } from "./swarmCw";

export const swarmCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenCheckeredCells", animation: swarmCw }],
    swarmCcw,
);
