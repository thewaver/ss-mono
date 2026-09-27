import { type GradientCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";

import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

export const sweep_1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
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
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                { value: defs.colors.primary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary), stop: 50 },
                            ],
                            offset: { x: -1.25, y: 0 },
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepOrthogonal("x", x1, x2, [0, 2.5], defs)}
                                {opts?.cycles &&
                                    SVGAnimations.Gradient.cycleSmoothColors(
                                        `gradient1-${id}`,
                                        [
                                            [
                                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                                SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                                SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                            ],
                                            [
                                                defs.colors.primary,
                                                defs.colors.secondary,
                                                defs.colors.tertiary,
                                                defs.colors.primary,
                                            ],
                                            [
                                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                                SVGDefsUtils.getTransparentColor(defs.colors.secondary),
                                                SVGDefsUtils.getTransparentColor(defs.colors.tertiary),
                                                SVGDefsUtils.getTransparentColor(defs.colors.primary),
                                            ],
                                        ],
                                        defs,
                                    )}
                            </>
                        ),
                    ),
            },
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
