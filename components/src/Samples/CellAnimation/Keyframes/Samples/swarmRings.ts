import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { swarmCcw } from "./swarmCcw";
import { swarmCw } from "./swarmCw";

export const swarmRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: swarmCw }],
    swarmCcw,
);
