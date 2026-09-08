import { MathUtils, ObjectUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

export const snake_4c: TimedGradientConfig = {
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
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                { value: defs.colors.secondary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary), stop: 50 },
                            ],
                        },
                        <>
                            {SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(0, 360, 12), defs)}
                            {SVGAnimations.Gradient.cycleSmoothColors(
                                `gradient1-${id}`,
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
                        </>,
                    ),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip1-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray("stretch", MathUtils.getIntermediateValues(0, 360, 12), [180]),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
        {
            gradientOrPattern: {
                id: `gradient2-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient2-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                { value: defs.colors.primary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary), stop: 50 },
                            ],
                            angle: 90,
                        },
                        <>
                            {SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(90, 450, 12), defs)}
                            {SVGAnimations.Gradient.cycleSmoothColors(
                                `gradient2-${id}`,
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
                        </>,
                    ),
            },
            clipPath: {
                id: `clip2-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip2-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray("stretch", MathUtils.getIntermediateValues(90, 450, 12), [180]),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
        {
            gradientOrPattern: {
                id: `gradient3-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient3-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary) },
                                { value: defs.colors.secondary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.secondary), stop: 50 },
                            ],
                            angle: 180,
                        },
                        <>
                            {SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(180, 540, 12), defs)}
                            {SVGAnimations.Gradient.cycleSmoothColors(
                                `gradient3-${id}`,
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
                        </>,
                    ),
            },
            clipPath: {
                id: `clip3-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip3-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray("stretch", MathUtils.getIntermediateValues(180, 540, 12), [180]),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
        {
            gradientOrPattern: {
                id: `gradient4-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient4-${id}`,
                            colors: [
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary) },
                                { value: defs.colors.primary, stop: 50 },
                                { value: SVGDefsUtils.getTransparentColor(defs.colors.primary), stop: 50 },
                            ],
                            angle: 270,
                        },
                        <>
                            {SVGAnimations.Linear.rotate(MathUtils.getIntermediateValues(270, 630, 12), defs)}
                            {SVGAnimations.Gradient.cycleSmoothColors(
                                `gradient4-${id}`,
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
                        </>,
                    ),
            },
            clipPath: {
                id: `clip4-${id}`,
                renderDefsElement: () => (
                    <clipPath id={`clip4-${id}`} clipPathUnits="objectBoundingBox">
                        {SVGAnimations.Path.rotatingArc(
                            ObjectUtils.zipArray("stretch", MathUtils.getIntermediateValues(270, 630, 12), [180]),
                            defs,
                        )}
                    </clipPath>
                ),
            },
        },
    ],
};
