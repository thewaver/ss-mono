import type { CellAnimationFn } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.types";
import { CellAnimationKeyframeUtils } from "../../../../Generators/CellAnimationKeyframes/CellAnimationKeyframes.utils";
import { hingeBottom } from "./hingeBottom";
import { hingeLeft } from "./hingeLeft";
import { hingeRight } from "./hingeRight";
import { hingeTop } from "./hingeTop";
import { zoomIn } from "./zoomIn";

export const hingeQuadrantInverted: CellAnimationFn = CellAnimationKeyframeUtils.fromZones(
    [
        { zone: "top", animation: hingeBottom },
        { zone: "bottom", animation: hingeTop },
        { zone: "left", animation: hingeRight },
        { zone: "right", animation: hingeLeft },
    ],
    zoomIn,
);
