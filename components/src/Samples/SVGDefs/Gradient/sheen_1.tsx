import { PointerTracker } from "../../../Abstracts/PointerTracker/PointerTracker";
import { SVGGradientDefsUtils } from "../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientConfig } from "../SVGDefs.types";
import { SVGDefsUtils } from "../SVGDefs.utils";

const POOL_SCALE = 1.6;
const CORE_STOP = 6;
const FALLOFF_STOP = 30;
const CORE_ALPHA = 0.85;
const FALLOFF_ALPHA = 0.25;

const NO_REF = () => undefined;

export const sheen_1: GradientConfig = {
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTracker.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        origin: () => getReading().boxRatio,
                        scale: POOL_SCALE,
                        colors: [
                            { value: defs.colors.primary },
                            { value: `rgb(from ${defs.colors.primary} r g b / ${CORE_ALPHA})`, stop: CORE_STOP },
                            {
                                value: `rgb(from ${defs.colors.secondary} r g b / ${FALLOFF_ALPHA})`,
                                stop: FALLOFF_STOP,
                            },
                            { value: `rgb(from ${defs.colors.secondary} r g b / 0)`, stop: 100 },
                        ],
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
};
