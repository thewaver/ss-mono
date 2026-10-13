import { type GradientBandOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { BandDiag1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

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

                    const angle = opts?.bandAngle ?? BandDiag1Const.DEFAULTS.bandAngle;

                    const getTravel = () =>
                        SVGDefsUtils.projectBoxRatioOntoAngle(getReading().boxRatio, angle) *
                        (opts?.bandTravel ?? BandDiag1Const.DEFAULTS.bandTravel);

                    return SVGGradientDefsSolidUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        colors: SVGDefsUtils.getFalloffStops(defs.colors.primary, {
                            coreStop: opts?.coreStop ?? BandDiag1Const.DEFAULTS.coreStop,
                            coreAlpha: opts?.coreAlpha ?? BandDiag1Const.DEFAULTS.coreAlpha,
                            falloffSpread: opts?.falloffSpread ?? BandDiag1Const.DEFAULTS.falloffSpread,
                            falloffAlpha: opts?.falloffAlpha ?? BandDiag1Const.DEFAULTS.falloffAlpha,
                        }),
                        angle,
                        scale: BandDiag1Const.BAND_SPAN,
                        offset: () => SVGDefsUtils.offsetDiagonally(getTravel(), angle),
                    });
                },
            },
            filter: SVGDefsSolidUtils.getBaseBlur(id, defs),
        },
    ],
});
