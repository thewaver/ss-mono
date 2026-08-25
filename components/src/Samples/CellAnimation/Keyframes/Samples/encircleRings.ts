import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { encircleCcw } from "./encircleCcw";
import { encircleCw } from "./encircleCw";

export const encircleRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: encircleCw }],
    encircleCcw,
);
