import { Show } from "solid-js";

import { type CycleColorKey, type GradientBandedCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { AngleUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const CYCLE_KEYS: CycleColorKey[] = ["primary", "secondary", "tertiary"];
const SMOOTH_REPEATS = 2;
const BANDED_REPEATS = 4;

export const flow_diag_3 = (opts?: GradientBandedCycleOpts): TimedGradientConfig => ({
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
                        SVGGradientDefsSolidUtils.computeLinearGradient(
                            {
                                id: `gradient1-${id}`,
                                colors: stopKeys.map((key) => ({ value: defs.colors[key] })),
                                spreadKind: opts?.banded ? "banded" : undefined,
                                angle: AngleUtils.unwarp(45, defs.getSize()),
                                scale: { width: 2, height: 2 },
                                offset: SVGDefsUtils.offsetDiagonally(
                                    opts?.banded ? 0.25 : 0.5,
                                    AngleUtils.unwarp(45, defs.getSize()),
                                ),
                            },
                            (x1, y1, x2, y2) => (
                                <>
                                    {SVGAnimations.Linear.sweepDiagonal(
                                        x1,
                                        y1,
                                        x2,
                                        y2,
                                        AngleUtils.unwarp(45, defs.getSize()),
                                        [0, opts?.banded ? -0.5 : -1],
                                        defs,
                                    )}
                                    <Show when={opts?.cycles}>
                                        {(opts?.banded
                                            ? SVGAnimations.Gradient.cycleBandedColors
                                            : SVGAnimations.Gradient.cycleSmoothColors)(
                                            `gradient1-${id}`,
                                            stopKeys.map((key) => SVGDefsUtils.getCycleWalk(defs.colors, key)),
                                            defs,
                                        )}
                                    </Show>
                                </>
                            ),
                        ),
                },
                filter: opts?.banded ? undefined : SVGDefsSolidUtils.getBaseBlur(id, defs),
            },
        ];
    },
});
