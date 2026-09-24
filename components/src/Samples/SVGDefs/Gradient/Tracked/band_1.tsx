import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefs.utils";
import type { GradientBandOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientDefaults } from "../TrackedGradient.const";

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

const DEFAULTS = TrackedGradientDefaults.BAND_DEFAULTS;

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
                        colors: SVGDefsUtils.getFalloffStops(defs.colors.primary, {
                            coreStop: opts?.coreStop ?? DEFAULTS.coreStop,
                            coreAlpha: opts?.coreAlpha ?? DEFAULTS.coreAlpha,
                            falloffSpread: opts?.falloffSpread ?? DEFAULTS.falloffSpread,
                            falloffAlpha: opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
                        }),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
