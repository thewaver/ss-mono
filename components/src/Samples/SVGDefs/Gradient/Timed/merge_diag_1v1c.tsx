import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const merge_diag_1v1c: TimedGradientConfig = {
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
                                { value: defs.colors.primary },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                            ],
                            angle: 45,
                            offset: SVGDefsUtils.offsetDiagonally(-1.25, 45),
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 45, [0, 2.5, 0], defs)}
                                {SVGAnimations.Gradient.cycleSmoothColors(
                                    `gradient1-${id}`,
                                    [
                                        [defs.colors.primary, defs.colors.secondary, defs.colors.primary],
                                        [
                                            SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                        ],
                                    ],
                                    defs,
                                )}
                            </>
                        ),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
            blend: true,
        },
        {
            gradientOrPattern: {
                id: `gradient2-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient2-${id}`,
                            colors: [
                                { value: defs.colors.secondary },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                            ],
                            angle: 225,
                            offset: SVGDefsUtils.offsetDiagonally(-1.25, 225),
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 225, [0, 2.5, 0], defs)}
                                {SVGAnimations.Gradient.cycleSmoothColors(
                                    `gradient2-${id}`,
                                    [
                                        [defs.colors.secondary, defs.colors.tertiary, defs.colors.secondary],
                                        [
                                            SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                            SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                        ],
                                    ],
                                    defs,
                                )}
                            </>
                        ),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
            blend: true,
        },
    ],
};
