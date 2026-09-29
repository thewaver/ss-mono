import { type GradientCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";

import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

export const scan_diag_1v1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
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
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
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
                                            ],
                                            defs,
                                        )}
                                </>
                            ),
                        ),
                },
                filter: sharedBlur,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsReactUtils.computeLinearGradient(
                            {
                                id: `gradient2-${id}`,
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                    { value: defs.colors.secondary },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                ],
                                angle: 135,
                                offset: SVGDefsUtils.offsetDiagonally(-1.25, 135),
                            },
                            (x1, y1, x2, y2) => (
                                <>
                                    {SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 135, [0, 2.5, 0], defs)}
                                    {opts?.cycles &&
                                        SVGAnimations.Gradient.cycleSmoothColors(
                                            `gradient2-${id}`,
                                            [
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
                                            ],
                                            defs,
                                        )}
                                </>
                            ),
                        ),
                },
                filter: sharedBlurRef,
            },
        ];
    },
});
