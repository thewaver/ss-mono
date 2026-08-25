import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { dripDown } from "./dripDown";
import { dripLeft } from "./dripLeft";
import { dripRight } from "./dripRight";
import { dripUp } from "./dripUp";
import { zoomIn } from "./zoomIn";

export const dripQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: dripUp },
        { zone: "bottom", animation: dripDown },
        { zone: "left", animation: dripLeft },
        { zone: "right", animation: dripRight },
    ],
    zoomIn,
);
