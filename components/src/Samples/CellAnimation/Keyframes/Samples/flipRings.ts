import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { flipHorizontal } from "./flipHorizontal";
import { flipVertical } from "./flipVertical";

export const flipRings: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [{ zone: "even_rings", animation: flipHorizontal }],
    flipVertical,
);
