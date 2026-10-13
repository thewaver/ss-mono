import { type GradientBandOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { Band1v1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const NO_REF = () => undefined;

const getBandColors = (color: string, opts?: GradientBandOpts) =>
    SVGDefsUtils.getFalloffStops(color, {
        coreStop: opts?.coreStop ?? Band1v1Const.DEFAULTS.coreStop,
        coreAlpha: opts?.coreAlpha ?? Band1v1Const.DEFAULTS.coreAlpha,
        falloffSpread: opts?.falloffSpread ?? Band1v1Const.DEFAULTS.falloffSpread,
        falloffAlpha: opts?.falloffAlpha ?? Band1v1Const.DEFAULTS.falloffAlpha,
    });

export const band_1v1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
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
                            colors: getBandColors(defs.colors.primary, opts),
                            angle: 0,
                            scale: Band1v1Const.BAND_SPAN,
                            offset: () => ({
                                x:
                                    (getReading().boxRatio.x - 0.5) *
                                    (opts?.bandTravel ?? Band1v1Const.DEFAULTS.bandTravel),
                                y: 0,
                            }),
                        });
                    },
                },
                filter: sharedBlur,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () => {
                        const { getReading } = PointerTrackerSolidUtils.create(
                            getRef ?? NO_REF,
                            undefined,
                            defs.getPointSource,
                        );

                        return SVGGradientDefsSolidUtils.computeLinearGradient({
                            id: `gradient2-${id}`,
                            colors: getBandColors(defs.colors.secondary, opts),
                            angle: 90,
                            scale: Band1v1Const.BAND_SPAN,
                            offset: () => ({
                                x: 0,
                                y:
                                    (getReading().boxRatio.y - 0.5) *
                                    (opts?.bandTravel ?? Band1v1Const.DEFAULTS.bandTravel),
                            }),
                        });
                    },
                },
                filter: sharedBlurRef,
                blend: true,
            },
        ];
    },
});
