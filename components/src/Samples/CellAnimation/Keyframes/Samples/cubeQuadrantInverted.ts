import type { CellAnimationFn } from "../CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../CellAnimationKeyframes.utils";
import { cubeBottom } from "./cubeBottom";
import { cubeLeft } from "./cubeLeft";
import { cubeRight } from "./cubeRight";
import { cubeTop } from "./cubeTop";
import { zoomIn } from "./zoomIn";

export const cubeQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: cubeBottom },
        { zone: "bottom", animation: cubeTop },
        { zone: "left", animation: cubeRight },
        { zone: "right", animation: cubeLeft },
    ],
    zoomIn,
);
