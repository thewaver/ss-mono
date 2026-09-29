import { type GradientStepsOpts, SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import type { TimedGradientConfig } from "../../SVGDefsSvelte.types.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";

export const orbit_async_2v1 = (opts?: GradientStepsOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
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
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
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
