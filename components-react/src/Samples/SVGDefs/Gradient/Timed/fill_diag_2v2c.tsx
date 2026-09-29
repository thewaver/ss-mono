import { SVGDefsUtils } from "@thewaver/ss-components";

import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

export const fill_diag_2v2c = (): TimedGradientConfig => ({
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
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
