import { SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { markup } from "../../../../Utils/markupUtils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import SVGSampleClipPath from "../../SVGSampleClipPath.svelte";
export const elastic_inter_semicircle_1 = (opts) => ({
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                    id: `gradient1-${id}`,
                    colors: [{ value: defs.colors.primary }],
                    angle: 90,
                }, opts?.cycles
                    ? SVGAnimations.Gradient.cycleSmoothColors(`gradient1-${id}`, [
                        [
                            defs.colors.primary,
                            defs.colors.secondary,
                            defs.colors.tertiary,
                            defs.colors.primary,
                        ],
                    ], defs)
                    : undefined),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => markup(SVGSampleClipPath, {
                    id: `clip1-${id}`,
                    content: SVGAnimations.Path.rotatingArc(ObjectUtils.zipArray("stretch", [
                        ...MathUtils.getIntermediateValues(0, 0, TimedGradientDefaults.STEPS_DEFAULT.steps),
                        ...MathUtils.getIntermediateValues(0, 180, TimedGradientDefaults.STEPS_DEFAULT.steps),
                        ...MathUtils.getIntermediateValues(180, 180, TimedGradientDefaults.STEPS_DEFAULT.steps),
                        ...MathUtils.getIntermediateValues(180, 360, TimedGradientDefaults.STEPS_DEFAULT.steps),
                    ], [
                        ...MathUtils.getIntermediateValues(0, 180, TimedGradientDefaults.STEPS_DEFAULT.steps),
                        ...MathUtils.getIntermediateValues(180, 0, TimedGradientDefaults.STEPS_DEFAULT.steps),
                        ...MathUtils.getIntermediateValues(0, 180, TimedGradientDefaults.STEPS_DEFAULT.steps),
                        ...MathUtils.getIntermediateValues(180, 0, TimedGradientDefaults.STEPS_DEFAULT.steps),
                    ]), defs),
                }),
            },
        },
    ],
});
