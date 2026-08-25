import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { skewCcw } from "./skewCcw";
import { skewCw } from "./skewCw";

export const skewRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "evenRings", animation: skewCw }],
    skewCcw,
);
