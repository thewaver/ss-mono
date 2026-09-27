import { type GradientStepsOpts, SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

export const orbit_async_2v1 = (opts?: GradientStepsOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const sharedBlur = SVGDefsSolidUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSolidUtils.computeLinearGradient(
                            {
                                id: `gradient1-${id}`,
                                colors: [{ value: defs.colors.tertiary }, { value: defs.colors.secondary }],
                            },
                            SVGAnimations.Linear.rotate(
                                MathUtils.getIntermediateValues(
                                    0,
                                    360,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                defs,
                            ),
                        ),
                },
                filter: sharedBlur,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSolidUtils.computeLinearGradient(
                            {
                                id: `gradient2-${id}`,
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                    { value: defs.colors.primary },
                                ],
                                angle: 360,
                            },
                            SVGAnimations.Linear.rotate(
                                MathUtils.getIntermediateValues(
                                    360,
                                    0,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                defs,
                            ),
                        ),
                },
                filter: sharedBlurRef,
            },
        ];
    },
});
