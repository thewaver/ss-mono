import { SVGDefsUtils } from "@thewaver/ss-components";
import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
export const fill_2c = () => ({
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => SVGGradientDefsSvelteUtils.computeLinearGradient({
                    id: `gradient1-${id}`,
                    colors: [{ value: defs.colors.primary }],
                    angle: 90,
                }, SVGAnimations.Gradient.cycleSmoothColors(`gradient1-${id}`, [
                    [
                        defs.colors.primary,
                        defs.colors.secondary,
                        defs.colors.primary,
                        defs.colors.secondary,
                        defs.colors.primary,
                    ],
                ], defs)),
            },
            filter: SVGDefsSvelteUtils.getBaseBlur(id, defs),
        },
    ],
});
