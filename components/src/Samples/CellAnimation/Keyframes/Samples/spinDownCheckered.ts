import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { spinDownCcw } from "./spinDownCcw";
import { spinDownCw } from "./spinDownCw";

export const spinDownCheckered: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenCheckeredCells", animation: spinDownCw }],
    spinDownCcw,
);
