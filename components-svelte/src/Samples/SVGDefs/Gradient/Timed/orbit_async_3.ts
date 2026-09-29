import { type GradientStepsOpts, SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import type { TimedGradientConfig } from "../../SVGDefsSvelte.types.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";

export const orbit_async_3 = (opts?: GradientStepsOpts): TimedGradientConfig => ({
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
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                    { value: defs.colors.primary },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                ],
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
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
                            {
                                id: `gradient2-${id}`,
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                    { value: defs.colors.secondary },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                ],
                            },
                            SVGAnimations.Linear.rotate(
                                [
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        360,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        360,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
                                defs,
                            ),
                        ),
                },
                filter: sharedBlurRef,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient3-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
                            {
                                id: `gradient3-${id}`,
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.tertiary) },
                                    { value: defs.colors.tertiary },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.tertiary) },
                                ],
                            },
                            SVGAnimations.Linear.rotate(
                                [
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        360,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        360,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        360,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
                                defs,
                            ),
                        ),
                },
                filter: sharedBlurRef,
                blend: true,
            },
        ];
    },
});
