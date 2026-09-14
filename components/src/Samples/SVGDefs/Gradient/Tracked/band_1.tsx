import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientBandOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };
const BAND_TRAVEL = 1;
const CORE_STOP = 50;
const FALLOFF_SPREAD = 25;
const CORE_ALPHA = 0.75;
const FALLOFF_ALPHA = 0.25;

const NO_REF = () => undefined;

export const band_1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        angle: 0,
                        scale: BAND_SPAN,
                        offset: () => ({
                            x: (getReading().boxRatio.x - 0.5) * (opts?.bandTravel ?? BAND_TRAVEL),
                            y: 0,
                        }),
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)` },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? FALLOFF_ALPHA})`,
                                stop: (opts?.coreStop ?? CORE_STOP) - (opts?.falloffSpread ?? FALLOFF_SPREAD),
                            },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.coreAlpha ?? CORE_ALPHA})`,
                                stop: opts?.coreStop ?? CORE_STOP,
                            },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? FALLOFF_ALPHA})`,
                                stop: (opts?.coreStop ?? CORE_STOP) + (opts?.falloffSpread ?? FALLOFF_SPREAD),
                            },
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                        ],
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
