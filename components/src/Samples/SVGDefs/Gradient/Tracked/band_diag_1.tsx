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
                        colors: SVGDefsUtils.getFalloffStops(defs.colors.primary, {
                            coreStop: opts?.coreStop ?? DEFAULTS.coreStop,
                            coreAlpha: opts?.coreAlpha ?? DEFAULTS.coreAlpha,
                            falloffSpread: opts?.falloffSpread ?? DEFAULTS.falloffSpread,
                            falloffAlpha: opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
                        }),
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
