import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { dripDown } from "./dripDown";
import { dripLeft } from "./dripLeft";
import { dripRight } from "./dripRight";
import { dripUp } from "./dripUp";
import { zoomIn } from "./zoomIn";

export const dripQuadrant: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: dripUp },
        { zone: "bottom", animation: dripDown },
        { zone: "left", animation: dripLeft },
        { zone: "right", animation: dripRight },
    ],
    zoomIn,
);
