import { type ShapeArrowAim, ShapeConst, type ShapeGeometry, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import { TooltipKnobs } from "../../Knobs/Tooltips.const";
import { JOIN_RADII, TOOLTIP_ARROW_TEMPLATES, type TooltipArrow } from "./TooltipContent.const";

export const computeTooltipGeometry = (
    size: Size2d,
    defs: { arrow?: TooltipArrow; arrowAim?: ShapeArrowAim; arrowWidth?: number; arrowLength?: number },
): ShapeGeometry => {
    const body = { points: ShapeConst.getDefaultShapePoints("square", size), joinRadii: JOIN_RADII };

    if (defs.arrow === undefined || defs.arrow === "none") return body;

    return ShapeUtils.attachArrow(
        body,
        defs.arrowAim,
        TOOLTIP_ARROW_TEMPLATES[defs.arrow](
            defs.arrowWidth ?? TooltipKnobs.STARTING_ARROW_WIDTH,
            defs.arrowLength ?? TooltipKnobs.STARTING_ARROW_LENGTH,
        ),
    );
};
