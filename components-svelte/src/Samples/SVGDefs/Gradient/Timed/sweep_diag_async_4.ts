import { type GradientCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";

import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import type { TimedGradientConfig } from "../../SVGDefsSvelte.types.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";

export const sweep_diag_async_4 = (opts?: GradientCycleOpts): TimedGradientConfig => ({
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
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
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
                            (x1, y1, x2, y2) => [
                                SVGAnimations.Linear.sweepDiagonal(
                                    x1,
                                    y1,
                                    x2,
                                    y2,
                                    45,
                                    [0, 1.25, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
                                    defs,
                                ),
                                opts?.cycles &&
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
                                    ),
                            ],
                        ),
                },
                filter: sharedBlur,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
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
                            (x1, y1, x2, y2) => [
                                SVGAnimations.Linear.sweepDiagonal(
                                    x1,
                                    y1,
                                    x2,
                                    y2,
                                    225,
                                    [0, 0, 0, 1.25, 2.5, 2.5, 2.5, 2.5, 2.5],
                                    defs,
                                ),
                                opts?.cycles &&
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
                                    ),
                            ],
                        ),
                },
                filter: sharedBlurRef,
            },
            {
                gradientOrPattern: {
                    id: `gradient3-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
                            {
                                id: `gradient3-${id}`,
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                    { value: defs.colors.primary, stop: 50 },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.primary), stop: 50 },
                                ],
                                angle: 135,
                                offset: SVGDefsUtils.offsetDiagonally(-1.25, 135),
                            },
                            (x1, y1, x2, y2) => [
                                SVGAnimations.Linear.sweepDiagonal(
                                    x1,
                                    y1,
                                    x2,
                                    y2,
                                    135,
                                    [0, 0, 0, 0, 0, 1.25, 2.5, 2.5, 2.5],
                                    defs,
                                ),
                                opts?.cycles &&
                                    SVGAnimations.Gradient.cycleSmoothColors(
                                        `gradient3-${id}`,
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
                                    ),
                            ],
                        ),
                },
                filter: sharedBlurRef,
            },
            {
                gradientOrPattern: {
                    id: `gradient4-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
                            {
                                id: `gradient4-${id}`,
                                colors: [
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                    { value: defs.colors.secondary, stop: 50 },
                                    { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary), stop: 50 },
                                ],
                                angle: 315,
                                offset: SVGDefsUtils.offsetDiagonally(-1.25, 315),
                            },
                            (x1, y1, x2, y2) => [
                                SVGAnimations.Linear.sweepDiagonal(
                                    x1,
                                    y1,
                                    x2,
                                    y2,
                                    315,
                                    [0, 0, 0, 0, 0, 0, 0, 1.25, 2.5],
                                    defs,
                                ),
                                opts?.cycles &&
                                    SVGAnimations.Gradient.cycleSmoothColors(
                                        `gradient4-${id}`,
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
                                    ),
                            ],
                        ),
                },
                filter: sharedBlurRef,
            },
        ];
    },
});
