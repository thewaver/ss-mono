import { SVGDefsUtils } from "@thewaver/ss-components";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
export const merge_diag_async_4 = () => ({
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
                            { value: defs.colors.primary },
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                        ],
                        angle: 45,
                        offset: SVGDefsUtils.offsetDiagonally(-1.25, 45),
                    }, (x1, y1, x2, y2) => SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 45, [0, 1.25, 2.5, 1.25, 0, 0, 0, 0], defs)),
                },
                filter: sharedBlur,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                        id: `gradient2-${id}`,
                        colors: [
                            { value: defs.colors.secondary },
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                        ],
                        angle: 135,
                        offset: SVGDefsUtils.offsetDiagonally(-1.25, 135),
                    }, (x1, y1, x2, y2) => SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 135, [0, 0, 0, 1.25, 2.5, 1.25, 0, 0], defs)),
                },
                filter: sharedBlurRef,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient3-${id}`,
                    renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                        id: `gradient3-${id}`,
                        colors: [
                            { value: defs.colors.primary },
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                        ],
                        angle: 225,
                        offset: SVGDefsUtils.offsetDiagonally(-1.25, 225),
                    }, (x1, y1, x2, y2) => SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 225, [0, 0, 1.25, 2.5, 1.25, 0, 0, 0], defs)),
                },
                filter: sharedBlurRef,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient4-${id}`,
                    renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                        id: `gradient4-${id}`,
                        colors: [
                            { value: defs.colors.secondary },
                            { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                        ],
                        angle: 315,
                        offset: SVGDefsUtils.offsetDiagonally(-1.25, 315),
                    }, (x1, y1, x2, y2) => SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 315, [0, 0, 0, 0, 1.25, 2.5, 1.25, 0], defs)),
                },
                filter: sharedBlurRef,
                blend: true,
            },
        ];
    },
});
