import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { shakeDown } from "./shakeDown";
import { shakeLeft } from "./shakeLeft";
import { shakeRight } from "./shakeRight";
import { shakeUp } from "./shakeUp";
import { zoomIn } from "./zoomIn";

export const shakeQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: shakeUp },
        { zone: "bottom", animation: shakeDown },
        { zone: "left", animation: shakeLeft },
        { zone: "right", animation: shakeRight },
    ],
    zoomIn,
);
