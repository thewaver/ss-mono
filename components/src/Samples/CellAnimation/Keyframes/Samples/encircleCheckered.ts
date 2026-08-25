import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { encircleCcw } from "./encircleCcw";
import { encircleCw } from "./encircleCw";

export const encircleCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenCheckeredCells", animation: encircleCw }],
    encircleCcw,
);
