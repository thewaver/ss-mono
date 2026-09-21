import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { GradientStepsOpts, TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TimedGradientKnobs } from "../TimedGradient.knobs";

export const snake_async_3 = (opts?: GradientStepsOpts): TimedGradientConfig => ({
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
                                opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                            ),
                            defs,
                        ),
                    ),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip1-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                ),
                                [180],
                            ),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
        {
            gradientOrPattern: {
                id: `gradient2-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
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
                                    opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                ),
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                ),
                            ],
                            defs,
                        ),
                    ),
            },
            clipPath: {
                id: `clip2-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip2-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                [
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                    ),
                                ],
                                [180],
                            ),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
        {
            gradientOrPattern: {
                id: `gradient3-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
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
                                    opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                ),
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                ),
                                ...MathUtils.getIntermediateValues(
                                    90,
                                    450,
                                    opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                ),
                            ],
                            defs,
                        ),
                    ),
            },
            clipPath: {
                id: `clip3-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip3-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray(
                                "stretch",
                                [
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                    ),
                                    ...MathUtils.getIntermediateValues(
                                        90,
                                        450,
                                        opts?.steps ?? TimedGradientKnobs.STEPS_DEFAULT.steps,
                                    ),
                                ],
                                [180],
                            ),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
    ],
});
