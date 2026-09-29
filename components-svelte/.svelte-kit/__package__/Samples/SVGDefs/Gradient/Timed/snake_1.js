import { SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { markup } from "../../../../Utils/markupUtils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import SVGSampleClipPath from "../../SVGSampleClipPath.svelte";
export const snake_1 = (opts) => ({
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
                    ],
                    angle: 90,
                }, [
                    SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(90, 450, opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps), defs),
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
                        ], defs),
                ]),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => markup(SVGSampleClipPath, {
                    id: `clip1-${id}`,
                    content: SVGAnimations.Path.rotatingArc(ObjectUtils.zipArray("stretch", MathUtils.getIntermediateValues(90, 450, opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps), [180]), defs),
                }),
            },
        },
    ],
});
