import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { GradientCycleOpts, TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const elastic_inter_semicircle_1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient1-${id}`,
                            colors: [{ value: defs.colors.primary }],
                            angle: 90,
                        },
                        opts?.cycles
                            ? SVGAnimations.Gradient.cycleSmoothColors(
                                  `gradient1-${id}`,
                                  [
                                      [
                                          defs.colors.primary,
                                          defs.colors.secondary,
                                          defs.colors.tertiary,
                                          defs.colors.primary,
                                      ],
                                  ],
                                  defs,
                              )
                            : undefined,
                    ),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip1-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                [
                                    ...MathUtils.getIntermediateValues(0, 0, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                    ...MathUtils.getIntermediateValues(0, 180, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                    ...MathUtils.getIntermediateValues(180, 180, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                    ...MathUtils.getIntermediateValues(180, 360, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                ],
                                [
                                    ...MathUtils.getIntermediateValues(0, 180, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                    ...MathUtils.getIntermediateValues(180, 0, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                    ...MathUtils.getIntermediateValues(0, 180, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                    ...MathUtils.getIntermediateValues(180, 0, SVGDefsUtils.DEFAULT_GRADIENT_STEPS),
                                ],
                            ),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
    ],
});
