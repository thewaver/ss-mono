import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { hingeBottom } from "./hingeBottom";
import { hingeLeft } from "./hingeLeft";
import { hingeRight } from "./hingeRight";
import { hingeTop } from "./hingeTop";
import { zoomIn } from "./zoomIn";

export const hingeQuadrant: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: hingeTop },
        { zone: "bottom", animation: hingeBottom },
        { zone: "left", animation: hingeLeft },
        { zone: "right", animation: hingeRight },
    ],
    zoomIn,
);
