import { SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
export const orbit_1 = (opts) => ({
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                    id: `gradient1-${id}`,
                    colors: [
                        { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                        { value: defs.colors.primary },
                        { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                    ],
                }, [
                    SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(0, 360, opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps), defs),
                    opts?.cycles &&
                        SVGAnimations.Gradient.cycleSmoothColors(`gradient1-${id}`, [
                            [
                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                            ],
                            [
                                defs.colors.primary,
                                defs.colors.secondary,
                                defs.colors.tertiary,
                                defs.colors.primary,
                            ],
                            [
                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                            ],
                        ], defs),
                ]),
            },
            filter: SVGDefsSvelteUtils.getBaseBlur(id, defs),
        },
    ],
});
