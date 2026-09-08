import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const snake_1c: TimedGradientConfig = {
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
                        <>
                            {SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(90, 450, 12), defs)}
                            {SVGAnimations.Gradient.cycleSmoothColors(
                                `gradient1-${id}`,
                                [
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
                                ],
                                defs,
                            )}
                        </>,
                    ),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip1-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray("stretch", MathUtils.getIntermediateValues(90, 450, 12), [180]),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
    ],
};
