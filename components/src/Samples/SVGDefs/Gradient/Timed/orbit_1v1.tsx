import { Show } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { GradientCycleStepsOpts, TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TimedGradientDefaults } from "../TimedGradient.const";

export const orbit_1v1 = (opts?: GradientCycleStepsOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const sharedBlur = SVGDefsUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
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
                                {SVGAnimations.Linear.rotate(
                                    MathUtils.getIntermediateValues(
                                        0,
                                        360,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    defs,
                                )}
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
                            </>,
                        ),
                },
                filter: sharedBlur,
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
                                    { value: defs.colors.secondary },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                ],
                                angle: 360,
                            },
                            <>
                                {SVGAnimations.Linear.rotate(
                                    MathUtils.getIntermediateValues(
                                        360,
                                        0,
                                        opts?.steps ?? TimedGradientDefaults.STEPS_DEFAULT.steps,
                                    ),
                                    defs,
                                )}
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
                            </>,
                        ),
                },
                filter: sharedBlurRef,
            },
        ];
    },
});
