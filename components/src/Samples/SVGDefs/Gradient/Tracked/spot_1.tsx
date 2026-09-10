import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

const POOL_SCALE = 1.5;
const CORE_STOP = 5;
const FALLOFF_STOP = 40;
const CORE_ALPHA = 0.75;
const FALLOFF_ALPHA = 0.25;

const NO_REF = () => undefined;

export const spot_1: TrackedGradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        origin: () => getReading().boxRatio,
                        scale: POOL_SCALE,
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 1)` },
                            { value: `rgb(from ${defs.colors.primary} r g b / ${CORE_ALPHA})`, stop: CORE_STOP },
                            { value: `rgb(from ${defs.colors.primary} r g b / ${FALLOFF_ALPHA})`, stop: FALLOFF_STOP },
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                        ],
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
};
