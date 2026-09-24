import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { dripDown } from "./dripDown";
import { dripLeft } from "./dripLeft";
import { dripRight } from "./dripRight";
import { dripUp } from "./dripUp";
import { zoomIn } from "./zoomIn";

export const dripQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: dripDown },
        { zone: "bottom", animation: dripUp },
        { zone: "left", animation: dripRight },
        { zone: "right", animation: dripLeft },
    ],
    zoomIn,
);
