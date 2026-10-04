import { type GradientBandOpts, SVGDefsUtils, TrackedGradientDefaults } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

const DEFAULTS = TrackedGradientDefaults.BAND_DIAGONAL_DEFAULTS;

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
                    const { getReading } = PointerTrackerSolidUtils.create(
                        getRef ?? NO_REF,
                        undefined,
                        defs.getPointSource,
                    );

                    const angle = opts?.bandAngle ?? DEFAULTS.bandAngle;

                    const getTravel = () =>
                        SVGDefsUtils.projectBoxRatioOntoAngle(getReading().boxRatio, angle) *
                        (opts?.bandTravel ?? DEFAULTS.bandTravel);

                    return SVGGradientDefsSolidUtils.computeLinearGradient({
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
            filter: SVGDefsSolidUtils.getBaseBlur(id, defs),
        },
    ],
});
