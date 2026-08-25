import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { spinDownCcw } from "./spinDownCcw";
import { spinDownCw } from "./spinDownCw";

export const spinDownRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: spinDownCw }],
    spinDownCcw,
);
