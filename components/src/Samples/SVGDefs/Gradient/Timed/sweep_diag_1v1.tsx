import { Show } from "solid-js";

import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { GradientCycleOpts, TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const sweep_diag_1v1 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
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
                                { value: defs.colors.primary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary), stop: 50 },
                            ],
                            angle: 45,
                            offset: SVGDefsUtils.offsetDiagonally(-1.25, 45),
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 45, [0, 2.5], defs)}
                                <Show when={opts?.cycles}>
                                    {SVGAnimations.Gradient.cycleSmoothColors(
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
                                </Show>
                            </>
                        ),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
        {
            gradientOrPattern: {
                id: `gradient2-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient2-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                { value: defs.colors.secondary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary), stop: 50 },
                            ],
                            angle: 225,
                            offset: SVGDefsUtils.offsetDiagonally(-1.25, 225),
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepDiagonal(x1, y1, x2, y2, 225, [0, 2.5], defs)}
                                <Show when={opts?.cycles}>
                                    {SVGAnimations.Gradient.cycleSmoothColors(
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
                                </Show>
                            </>
                        ),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
