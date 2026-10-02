import { type GradientStepsOpts, SVGDefsUtils, TimedGradientDefaults } from "@thewaver/ss-components";
import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsReact.types";

export const snake_async_3 = (opts?: GradientStepsOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsReactUtils.computeLinearGradient(
                        {
                            id: `gradient1-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                { value: defs.colors.primary },
                            ],
                            angle: 90,
                        },
                        SVGAnimations.Linear.rotate(
                            MathUtils.getIntermediateValues(
                                90,
                                450,
                                opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                            ),
                            defs,
                        ),
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
                    SVGGradientDefsReactUtils.computeLinearGradient(
                        {
                            id: `gradient2-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                { value: defs.colors.secondary },
                            ],
                            angle: 90,
                        },
                        SVGAnimations.Linear.rotate(
                            [
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                            ],
                            defs,
                        ),
                    ),
            },
            clipPath: {
                id: `clip2-${id}`,
                renderDefsElement: () => (
                    <SVGClipPath id={`clip2-${id}`}>
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                [
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
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
                id: `gradient3-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsReactUtils.computeLinearGradient(
                        {
                            id: `gradient3-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.tertiary) },
                                { value: defs.colors.tertiary },
                            ],
                            angle: 90,
                        },
                        SVGAnimations.Linear.rotate(
                            [
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                ),
                            ],
                            defs,
                        ),
                    ),
            },
            clipPath: {
                id: `clip3-${id}`,
                renderDefsElement: () => (
                    <SVGClipPath id={`clip3-${id}`}>
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                [
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                ],
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
