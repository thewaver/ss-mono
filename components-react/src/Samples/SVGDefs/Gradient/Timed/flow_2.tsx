import { type GradientBandedCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { Flow2Const } from "@thewaver/ss-components/internal";

import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

export const flow_2 = (opts?: GradientBandedCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const stopKeys = SVGDefsUtils.getCycleStopKeys(
            Flow2Const.CYCLE_KEYS,
            opts?.bands ?? (opts?.banded ? Flow2Const.BANDED_REPEATS : Flow2Const.SMOOTH_REPEATS),
        );

        return [
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsReactUtils.computeLinearGradient(
                            {
                                id: `gradient1-${id}`,
                                colors: stopKeys.map((key) => ({ value: defs.colors[key] })),
                                spreadKind: opts?.banded ? "banded" : undefined,
                                scale: { width: 2, height: 1 },
                                offset: { x: 0.5, y: 0 },
                            },
                            (x1, y1, x2, y2) => (
                                <>
                                    {SVGAnimations.Linear.sweepOrthogonal("x", x1, x2, [0, -1], defs)}
                                    {opts?.cycles &&
                                        (opts?.banded
                                            ? SVGAnimations.Gradient.cycleBandedColors
                                            : SVGAnimations.Gradient.cycleSmoothColors)(
                                            `gradient1-${id}`,
                                            stopKeys.map((key) => SVGDefsUtils.getCycleWalk(defs.colors, key)),
                                            defs,
                                        )}
                                </>
                            ),
                        ),
                },
                filter: opts?.banded ? undefined : SVGDefsReactUtils.getBaseBlur(id, defs),
            },
        ];
    },
});
