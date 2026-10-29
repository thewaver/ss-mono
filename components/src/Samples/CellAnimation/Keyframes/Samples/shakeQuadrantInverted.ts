import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { shakeDown } from "./shakeDown";
import { shakeLeft } from "./shakeLeft";
import { shakeRight } from "./shakeRight";
import { shakeUp } from "./shakeUp";
import { zoomIn } from "./zoomIn";

export const shakeQuadrantInverted: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: shakeDown },
        { zone: "bottom", animation: shakeUp },
        { zone: "left", animation: shakeRight },
        { zone: "right", animation: shakeLeft },
    ],
    zoomIn,
);
