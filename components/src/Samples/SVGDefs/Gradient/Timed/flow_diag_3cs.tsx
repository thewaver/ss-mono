import { MathUtils } from "@thewaver/ss-utils";

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
    "secondary",
    "tertiary",
    "primary",
    "secondary",
    "tertiary",
    "primary",
];

export const flow_diag_3cs: TimedGradientConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () =>
                    SVGGradientDefsUtils.computeLinearGradient(
                        {
                            id: `gradient1-${id}`,
                            colors: STOP_KEYS.map((key) => ({ value: defs.colors[key] })),
                            spreadKind: "banded",
                            angle: MathUtils.unwarpAngle(45, defs.getSize()),
                            scale: { width: 2, height: 2 },
                            offset: SVGDefsUtils.offsetDiagonally(0.25, MathUtils.unwarpAngle(45, defs.getSize())),
                        },
                        (x1, y1, x2, y2) => (
                            <>
                                {SVGAnimations.Linear.sweepDiagonal(
                                    x1,
                                    y1,
                                    x2,
                                    y2,
                                    MathUtils.unwarpAngle(45, defs.getSize()),
                                    [0, -0.5],
                                    defs,
                                )}
                                {SVGAnimations.Gradient.cycleBandedColors(
                                    `gradient1-${id}`,
                                    STOP_KEYS.map((key) => SVGDefsUtils.getCycleWalk(defs.colors, key)),
                                    defs,
                                )}
                            </>
                        ),
                    ),
            },
        },
    ],
};
