import { Show } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { GradientCycleOpts, TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const orbit_1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
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
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                { value: defs.colors.primary },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                            ],
                        },
                        <>
                            {SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(0, 360, 12), defs)}
                            <Show when={opts?.cycles}>
                                {SVGAnimations.Gradient.cycleSmoothColors(
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
                            </Show>
                        </>,
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
