import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { GradientCycleOpts, TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TimedGradientDefaults } from "../TimedGradient.const";

export const elastic_semicircle_1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
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
                                    ...MathUtils.getIntermediateValues(
                                        180,
                                        90,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        180,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
                                [
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        180,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        180,
                                        0,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
                            ),
                            defs,
                        )}
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                [
                                    ...MathUtils.getIntermediateValues(
                                        360,
                                        270,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        270,
                                        360,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
                                [
                                    ...MathUtils.getIntermediateValues(
                                        0,
                                        180,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        180,
                                        0,
                                        TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
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
