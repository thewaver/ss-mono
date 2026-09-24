import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { spinUpCcw } from "./spinUpCcw";
import { spinUpCw } from "./spinUpCw";

export const spinUpRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: spinUpCw }],
    spinUpCcw,
);
