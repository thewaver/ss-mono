import { SVGDefsUtils } from "@thewaver/ss-components";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
export const sweep_diag_1v1 = (opts) => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        colors: [
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                            { value: defs.colors.primary, stop: 50 },
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.primary), stop: 50 },
                        ],
                        angle: 45,
                        offset: SVGDefsUtils.offsetDiagonally(-1.25, 45),
                    }, (x1, y1, x2, y2) => [
                        SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 45, [0, 2.5], defs),
                        opts?.cycles &&
                            SVGAnimations.Gradient.cycleSmoothColors(`gradient1-${id}`, [
                                [
                                    SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                ],
                                [defs.colors.primary, defs.colors.secondary, defs.colors.primary],
                                [
                                    SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                ],
                            ], defs),
                    ]),
                },
                filter: sharedBlur,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                        id: `gradient2-${id}`,
                        colors: [
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                            { value: defs.colors.secondary, stop: 50 },
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary), stop: 50 },
                        ],
                        angle: 225,
                        offset: SVGDefsUtils.offsetDiagonally(-1.25, 225),
                    }, (x1, y1, x2, y2) => [
                        SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 225, [0, 2.5], defs),
                        opts?.cycles &&
                            SVGAnimations.Gradient.cycleSmoothColors(`gradient2-${id}`, [
                                [
                                    SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                ],
                                [defs.colors.secondary, defs.colors.tertiary, defs.colors.secondary],
                                [
                                    SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                    SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                ],
                            ], defs),
                    ]),
                },
                filter: sharedBlurRef,
            },
        ];
    },
});
