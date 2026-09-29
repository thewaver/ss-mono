import { type CycleColorKey, type GradientBandedCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";

import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

const CYCLE_KEYS: CycleColorKey[] = ["primary", "secondary", "tertiary"];
const SMOOTH_REPEATS = 2;
const BANDED_REPEATS = 4;

export const flow_3 = (opts?: GradientBandedCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const stopKeys = SVGDefsUtils.getCycleStopKeys(
            CYCLE_KEYS,
            opts?.bands ?? (opts?.banded ? BANDED_REPEATS : SMOOTH_REPEATS),
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
