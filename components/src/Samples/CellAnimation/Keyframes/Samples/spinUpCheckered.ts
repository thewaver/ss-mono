import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { spinUpCcw } from "./spinUpCcw";
import { spinUpCw } from "./spinUpCw";

export const spinUpCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenCheckeredCells", animation: spinUpCw }],
    spinUpCcw,
);
