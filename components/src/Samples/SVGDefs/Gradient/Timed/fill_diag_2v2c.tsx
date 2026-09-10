import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const fill_diag_2v2c = (): TimedGradientConfig => ({
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
                            colors: [{ value: defs.colors.primary }, { value: defs.colors.secondary }],
                            angle: 45,
                        },
                        SVGAnimations.Gradient.cycleSmoothColors(
                            `gradient1-${id}`,
                            [
                                [
                                    defs.colors.primary,
                                    defs.colors.secondary,
                                    defs.colors.secondary,
                                    defs.colors.primary,
                                    defs.colors.primary,
                                ],
                                [
                                    defs.colors.primary,
                                    defs.colors.primary,
                                    defs.colors.tertiary,
                                    defs.colors.tertiary,
                                    defs.colors.primary,
                                ],
                            ],
                            defs,
                        ),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
