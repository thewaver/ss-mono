import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientBandOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientKnobs } from "../TrackedGradient.knobs";

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

const DEFAULTS = TrackedGradientKnobs.BAND_DIAGONAL_DEFAULTS;

const NO_REF = () => undefined;

export const band_diag_1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    const angle = opts?.bandAngle ?? DEFAULTS.bandAngle;

                    const getTravel = () =>
                        SVGDefsUtils.projectBoxRatioOntoAngle(getReading().boxRatio, angle) *
                        (opts?.bandTravel ?? DEFAULTS.bandTravel);

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
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
                        angle,
                        scale: BAND_SPAN,
                        offset: () => SVGDefsUtils.offsetDiagonally(getTravel(), angle),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
