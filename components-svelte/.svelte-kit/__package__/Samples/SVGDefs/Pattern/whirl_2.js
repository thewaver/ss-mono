import { SVGDefsUtils } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";
import { SVGGradientDefsSvelteUtils } from "../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { markup } from "../../../Utils/markupUtils.js";
import { SVGAnimations } from "../SVGAnimations.const.js";
import SVGSampleClipPath from "../SVGSampleClipPath.svelte";
export const whirl_2 = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            color: SVGDefsUtils.getBaseBackgroundColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => SVGGradientDefsSvelteUtils.computeRadialGradient({
                    id: `gradient1-${id}`,
                    colors: [
                        { value: defs.colors.primary },
                        { value: defs.colors.primary },
                        { value: defs.colors.secondary },
                        { value: defs.colors.primary },
                    ],
                }, SVGAnimations.Radial.grow([0, 2], {
                    ...defs,
                    animationDurationMs: defs.animationDurationMs * 0.5,
                })),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => markup(SVGSampleClipPath, {
                    id: `clip1-${id}`,
                    content: SVGAnimations.Path.rotatingWedges(Math.max(defs.cellSize.width, defs.cellSize.height), 0.75, 0, MathUtils.getIntermediateValues(0, 360, 12), defs),
                }),
            },
        },
    ],
};
