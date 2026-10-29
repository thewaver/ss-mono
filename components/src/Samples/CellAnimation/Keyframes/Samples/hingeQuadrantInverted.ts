import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { hingeBottom } from "./hingeBottom";
import { hingeLeft } from "./hingeLeft";
import { hingeRight } from "./hingeRight";
import { hingeTop } from "./hingeTop";
import { zoomIn } from "./zoomIn";

export const hingeQuadrantInverted: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: hingeBottom },
        { zone: "bottom", animation: hingeTop },
        { zone: "left", animation: hingeRight },
        { zone: "right", animation: hingeLeft },
    ],
    zoomIn,
);
