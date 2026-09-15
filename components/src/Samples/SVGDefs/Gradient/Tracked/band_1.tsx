import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientBandOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientKnobs } from "../TrackedGradient.knobs";

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

const DEFAULTS = TrackedGradientKnobs.BAND_DEFAULTS;

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
                            x: (getReading().boxRatio.x - 0.5) * (opts?.bandTravel ?? DEFAULTS.bandTravel),
                            y: 0,
                        }),
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)` },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                                stop:
                                    (opts?.coreStop ?? DEFAULTS.coreStop) -
                                    (opts?.falloffSpread ?? DEFAULTS.falloffSpread),
                            },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.coreAlpha ?? DEFAULTS.coreAlpha})`,
                                stop: opts?.coreStop ?? DEFAULTS.coreStop,
                            },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                                stop:
                                    (opts?.coreStop ?? DEFAULTS.coreStop) +
                                    (opts?.falloffSpread ?? DEFAULTS.falloffSpread),
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
