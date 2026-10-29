import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { shootDown } from "./shootDown";
import { shootLeft } from "./shootLeft";
import { shootRight } from "./shootRight";
import { shootUp } from "./shootUp";
import { zoomIn } from "./zoomIn";

export const shootQuadrantInverted: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: shootDown },
        { zone: "bottom", animation: shootUp },
        { zone: "left", animation: shootRight },
        { zone: "right", animation: shootLeft },
    ],
    zoomIn,
);
