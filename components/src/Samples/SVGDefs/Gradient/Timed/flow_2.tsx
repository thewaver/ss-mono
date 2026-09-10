import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const flow_2: TimedGradientConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient1-${id}`,
                            colors: [
                                { value: defs.colors.primary },
                                { value: defs.colors.secondary },
                                { value: defs.colors.primary },
                                { value: defs.colors.secondary },
                                { value: defs.colors.primary },
                                { value: defs.colors.secondary },
                                { value: defs.colors.primary },
                            ],
                            scale: { width: 2, height: 1 },
                            offset: { x: 0.5, y: 0 },
                        },
                        (x1, y1, x2, y2) => SVGAnimations.Linear.sweepOrthogonal("x", x1, x2, [0, -1], defs),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
};
