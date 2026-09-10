import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

const STOP_KEYS: SVGDefsUtils.CycleColorKey[] = [
    "primary",
    "secondary",
    "tertiary",
    "primary",
    "secondary",
    "tertiary",
    "primary",
];

export const flow_3c: TimedGradientConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient1-${id}`,
                            colors: STOP_KEYS.map((key) => ({ value: defs.colors[key] })),
                            scale: { width: 2, height: 1 },
                            offset: { x: 0.5, y: 0 },
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepOrthogonal("x", x1, x2, [0, -1], defs)}
                                {SVGAnimations.Gradient.cycleSmoothColors(
                                    `gradient1-${id}`,
                                    STOP_KEYS.map((key) => SVGDefsUtils.getCycleWalk(defs.colors, key)),
                                    defs,
                                )}
                            </>
                        ),
                    ),
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
};
