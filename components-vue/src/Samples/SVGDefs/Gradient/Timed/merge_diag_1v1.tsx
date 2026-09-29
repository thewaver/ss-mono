import { type GradientCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";

import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

export const merge_diag_1v1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsVueUtils.computeLinearGradient(
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
                                    {opts?.cycles &&
                                        SVGAnimations.Gradient.cycleSmoothColors(
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
                filter: sharedBlur,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsVueUtils.computeLinearGradient(
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
                                    {opts?.cycles &&
                                        SVGAnimations.Gradient.cycleSmoothColors(
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
                filter: sharedBlurRef,
                blend: true,
            },
        ];
    },
});
