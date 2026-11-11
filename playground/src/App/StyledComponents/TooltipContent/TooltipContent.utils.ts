import type { ShapeFillGeom, ShapeStrokeGeom } from "@thewaver/ss-components";
import {
    type ShapeArrowAim,
    ShapeConst,
    type ShapeGeometry,
    type ShapeJoinRadius,
    ShapeUtils,
    type Size2d,
} from "@thewaver/ss-utils";

import { TooltipKnobs } from "../../Knobs/Tooltips.const";
import { DEFAULT_TOOLTIP_ARROW, JOIN_RADII, TOOLTIP_ARROW_TEMPLATES, type TooltipArrow } from "./TooltipContent.const";
import type { TooltipBodyStyle } from "./TooltipContent.types";

export const getTooltipHasArrow = (arrow: TooltipArrow | undefined) => (arrow ?? DEFAULT_TOOLTIP_ARROW) !== "none";

export const toTooltipBodyStyle = (
    converted: { joinRadii: ShapeJoinRadius[]; lameExponents: number[]; strokeGeom: ShapeStrokeGeom[] } | undefined,
): TooltipBodyStyle | undefined =>
    converted && {
        joinRadii: converted.joinRadii,
        lameExponents: converted.lameExponents,
        strokeThicknesses: converted.strokeGeom.map((geom) => geom.thicknesses),
    };

export const computeTooltipGeometry = (
    size: Size2d,
    defs: { arrow?: TooltipArrow; arrowAim?: ShapeArrowAim; arrowWidth?: number; arrowLength?: number },
    bodyStyle?: TooltipBodyStyle,
): ShapeGeometry => {
    const arrow = defs.arrow ?? DEFAULT_TOOLTIP_ARROW;
    const body = {
        points: ShapeConst.getDefaultShapePoints("square", size),
        joinRadii: bodyStyle?.joinRadii ?? JOIN_RADII,
        lameExponents: bodyStyle?.lameExponents,
        strokeThicknesses: bodyStyle?.strokeThicknesses,
    };

    if (arrow === "none") return body;

    return ShapeUtils.attachArrow(
        body,
        defs.arrowAim,
        TOOLTIP_ARROW_TEMPLATES[arrow](
            defs.arrowWidth ?? TooltipKnobs.STARTING_ARROW_WIDTH,
            defs.arrowLength ?? TooltipKnobs.STARTING_ARROW_LENGTH,
        ),
    );
};

const fitToArrow = <T extends { offsets?: number[]; joinRadii?: ShapeJoinRadius[] }>(geom: T): T => {
    const offsets = geom.offsets ?? [0];

    return offsets.every((offset) => offset === offsets[0])
        ? { ...geom, offsets: [offsets[0]], joinRadii: undefined }
        : geom;
};

export const fitFillGeomToArrow = (fillGeom: (ShapeFillGeom | undefined)[], hasArrow: boolean) => {
    if (!hasArrow) return fillGeom;

    return fillGeom.map((geom) => geom && { ...fitToArrow(geom), clip: geom.clip && fitToArrow(geom.clip) });
};
