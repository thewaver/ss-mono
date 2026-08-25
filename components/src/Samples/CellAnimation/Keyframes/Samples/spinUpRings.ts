import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { spinUpCcw } from "./spinUpCcw";
import { spinUpCw } from "./spinUpCw";

export const spinUpRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: spinUpCw }],
    spinUpCcw,
);
