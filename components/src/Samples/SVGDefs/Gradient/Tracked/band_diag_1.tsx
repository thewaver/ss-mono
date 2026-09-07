import type { Size2d } from "@thewaver/ss-utils";

import { PointerTracker } from "../../../../Abstracts/PointerTracker/PointerTracker";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

const BAND_ANGLE = 45;
const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };
const BAND_TRAVEL = 1.25;
const CORE_STOP = 50;
const FALLOFF_SPREAD = 25;
const CORE_ALPHA = 0.75;
const FALLOFF_ALPHA = 0.25;

const NO_REF = () => undefined;

export const band_diag_1: TrackedGradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTracker.create(getRef ?? NO_REF);

                    const getTravel = () => {
                        const ratio = getReading().boxRatio;

                        return (ratio.x + ratio.y - 1) * BAND_TRAVEL * 0.5;
                    };

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)` },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${FALLOFF_ALPHA})`,
                                stop: CORE_STOP - FALLOFF_SPREAD,
                            },
                            { value: `rgb(from ${defs.colors.primary} r g b / ${CORE_ALPHA})`, stop: CORE_STOP },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${FALLOFF_ALPHA})`,
                                stop: CORE_STOP + FALLOFF_SPREAD,
                            },
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                        ],
                        angle: BAND_ANGLE,
                        scale: BAND_SPAN,
                        offset: () => SVGDefsUtils.offsetDiagonally(getTravel(), BAND_ANGLE),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
};
