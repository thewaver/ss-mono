import { type GradientCycleStepsOpts, SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsVue.types";

export const snake_2 = (opts?: GradientCycleStepsOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsVueUtils.computeLinearGradient(
                        {
                            id: `gradient1-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                { value: defs.colors.primary },
                            ],
                            angle: 90,
                        },
                        <>
                            {SVGAnimations.Linear.rotate(
                                MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                defs,
                            )}
                            {opts?.cycles &&
                                SVGAnimations.Gradient.cycleSmoothColors(
                                    `gradient1-${id}`,
                                    [
                                        [
                                            SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                        ],
                                        [defs.colors.primary, defs.colors.secondary, defs.colors.primary],
                                    ],
                                    defs,
                                )}
                        </>,
                    ),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => (
                    <SVGClipPath id={`clip1-${id}`}>
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                [180],
                            ),
                            defs,
                        )}
                    </SVGClipPath>
                ),
            },
        },
        {
            gradientOrPattern: {
                id: `gradient2-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsVueUtils.computeLinearGradient(
                        {
                            id: `gradient2-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                { value: defs.colors.secondary },
                            ],
                            angle: 270,
                        },
                        <>
                            {SVGAnimations.Linear.rotate(
                                MathUtils.getIntermediateValues(
                                    270,
                                    630,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                defs,
                            )}
                            {opts?.cycles &&
                                SVGAnimations.Gradient.cycleSmoothColors(
                                    `gradient2-${id}`,
                                    [
                                        [
                                            SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                        ],
                                        [defs.colors.secondary, defs.colors.tertiary, defs.colors.secondary],
                                    ],
                                    defs,
                                )}
                        </>,
                    ),
            },
            clipPath: {
                id: `clip2-${id}`,
                renderDefsElement: () => (
                    <SVGClipPath id={`clip2-${id}`}>
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                MathUtils.getIntermediateValues(
                                    270,
                                    630,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                [180],
                            ),
                            defs,
                        )}
                    </SVGClipPath>
                ),
            },
        },
    ],
});
