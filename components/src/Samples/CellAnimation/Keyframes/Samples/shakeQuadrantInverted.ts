import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { shakeDown } from "./shakeDown";
import { shakeLeft } from "./shakeLeft";
import { shakeRight } from "./shakeRight";
import { shakeUp } from "./shakeUp";
import { zoomIn } from "./zoomIn";

export const shakeQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: shakeDown },
        { zone: "bottom", animation: shakeUp },
        { zone: "left", animation: shakeRight },
        { zone: "right", animation: shakeLeft },
    ],
    zoomIn,
);
