import { type GradientBandOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { Band1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

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
                    const { getReading } = PointerTrackerSolidUtils.create(
                        getRef ?? NO_REF,
                        undefined,
                        defs.getPointSource,
                    );

                    return SVGGradientDefsSolidUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        angle: 0,
                        scale: Band1Const.BAND_SPAN,
                        offset: () => ({
                            x: (getReading().boxRatio.x - 0.5) * (opts?.bandTravel ?? Band1Const.DEFAULTS.bandTravel),
                            y: 0,
                        }),
                        colors: SVGDefsUtils.getFalloffStops(defs.colors.primary, {
                            coreStop: opts?.coreStop ?? Band1Const.DEFAULTS.coreStop,
                            coreAlpha: opts?.coreAlpha ?? Band1Const.DEFAULTS.coreAlpha,
                            falloffSpread: opts?.falloffSpread ?? Band1Const.DEFAULTS.falloffSpread,
                            falloffAlpha: opts?.falloffAlpha ?? Band1Const.DEFAULTS.falloffAlpha,
                        }),
                    });
                },
            },
            filter: SVGDefsSolidUtils.getBaseBlur(id, defs),
        },
    ],
});
