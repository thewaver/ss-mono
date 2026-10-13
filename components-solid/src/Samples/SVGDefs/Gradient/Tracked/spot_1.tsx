import { type GradientSpotOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { Spot1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const NO_REF = () => undefined;

export const spot_1 = (opts?: GradientSpotOpts): TrackedGradientConfig => ({
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

                    return SVGGradientDefsSolidUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        elementSize:
                            (opts?.circular ?? Spot1Const.DEFAULTS.circular) ? () => defs.getSize() : undefined,
                        origin: () => getReading().boxRatio,
                        scale: opts?.glowScale ?? Spot1Const.DEFAULTS.glowScale,
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 1)` },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.coreAlpha ?? Spot1Const.DEFAULTS.coreAlpha})`,
                                stop: opts?.coreStop ?? Spot1Const.DEFAULTS.coreStop,
                            },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? Spot1Const.DEFAULTS.falloffAlpha})`,
                                stop: opts?.falloffStop ?? Spot1Const.DEFAULTS.falloffStop,
                            },
                            { value: `rgb(from ${defs.colors.primary} r g b / 0)`, stop: 100 },
                        ],
                    });
                },
            },
            filter: SVGDefsSolidUtils.getBaseBlur(id, defs),
        },
    ],
});
