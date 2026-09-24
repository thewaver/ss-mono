import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { spinDownCcw } from "./spinDownCcw";
import { spinDownCw } from "./spinDownCw";

export const spinDownRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: spinDownCw }],
    spinDownCcw,
);
