import { type GradientSpotOpts, SVGDefsUtils, TrackedGradientDefaults } from "@thewaver/ss-components";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const DEFAULTS = TrackedGradientDefaults.SPOT_DEFAULTS;

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
                    const { getReading } = PointerTrackerSolidUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsSolidUtils.computeRadialGradient({
                        id: `gradient1-${id}`,
                        elementSize: (opts?.circular ?? DEFAULTS.circular) ? () => defs.getSize() : undefined,
                        origin: () => getReading().boxRatio,
                        scale: opts?.glowScale ?? DEFAULTS.glowScale,
                        colors: [
                            { value: `rgb(from ${defs.colors.primary} r g b / 1)` },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.coreAlpha ?? DEFAULTS.coreAlpha})`,
                                stop: opts?.coreStop ?? DEFAULTS.coreStop,
                            },
                            {
                                value: `rgb(from ${defs.colors.primary} r g b / ${opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                                stop: opts?.falloffStop ?? DEFAULTS.falloffStop,
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
