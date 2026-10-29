import type { SliceAnimationFn } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.types";
import { SliceAnimationKeyframeUtils } from "../../../../Generators/SliceAnimationKeyframes/SliceAnimationKeyframes.utils";
import { cubeBottom } from "./cubeBottom";
import { cubeLeft } from "./cubeLeft";
import { cubeRight } from "./cubeRight";
import { cubeTop } from "./cubeTop";
import { zoomIn } from "./zoomIn";

export const cubeQuadrantInverted: SliceAnimationFn = SliceAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: cubeBottom },
        { zone: "bottom", animation: cubeTop },
        { zone: "left", animation: cubeRight },
        { zone: "right", animation: cubeLeft },
    ],
    zoomIn,
);
