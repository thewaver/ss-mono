import { type GradientBandedCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { Flow3Const } from "@thewaver/ss-components/internal";

import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
import { SVGAnimations } from "../../SVGAnimations.const.js";
import type { TimedGradientConfig } from "../../SVGDefsSvelte.types.js";
import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";

export const flow_3 = (opts?: GradientBandedCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const stopKeys = SVGDefsUtils.getCycleStopKeys(
            Flow3Const.CYCLE_KEYS,
            opts?.bands ?? (opts?.banded ? Flow3Const.BANDED_REPEATS : Flow3Const.SMOOTH_REPEATS),
        );

        return [
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () =>
                        SVGGradientDefsSvelteUtils.computeLinearGradient(
                            {
                                id: `gradient1-${id}`,
                                colors: stopKeys.map((key) => ({ value: defs.colors[key] })),
                                spreadKind: opts?.banded ? "banded" : undefined,
                                scale: { width: 2, height: 1 },
                                offset: { x: 0.5, y: 0 },
                            },
                            (x1, y1, x2, y2) => [
                                SVGAnimations.Linear.sweepOrthogonal("x", x1, x2, [0, -1], defs),
                                opts?.cycles &&
                                    (opts?.banded
                                        ? SVGAnimations.Gradient.cycleBandedColors
                                        : SVGAnimations.Gradient.cycleSmoothColors)(
                                        `gradient1-${id}`,
                                        stopKeys.map((key) => SVGDefsUtils.getCycleWalk(defs.colors, key)),
                                        defs,
                                    ),
                            ],
                        ),
                },
                filter: opts?.banded ? undefined : SVGDefsSvelteUtils.getBaseBlur(id, defs),
            },
        ];
    },
});
