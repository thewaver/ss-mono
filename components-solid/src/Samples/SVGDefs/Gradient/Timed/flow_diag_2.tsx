import { Show, createMemo } from "solid-js";

import { type CycleColorKey, type GradientBandedCycleOpts, SVGDefsUtils } from "@thewaver/ss-components";
import { AngleUtils, SVGUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import { SVGAnimations } from "../../SVGAnimations.const";
import type { TimedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

const CYCLE_KEYS: CycleColorKey[] = ["primary", "secondary"];
const SMOOTH_REPEATS = 3;
const BANDED_REPEATS = 8;
const SCALE = { width: 2, height: 2 };

export const flow_diag_2 = (opts?: GradientBandedCycleOpts): TimedGradientConfig => ({
    computeSVGDefs: (id, __, ___, defs) => {
        const stopKeys = SVGDefsUtils.getCycleStopKeys(
            CYCLE_KEYS,
            opts?.bands ?? (opts?.banded ? BANDED_REPEATS : SMOOTH_REPEATS),
        );

        return [
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => {
                        const getAngle = createMemo(() => AngleUtils.unwarp(45, defs.getSize()));
                        const getOffset = () => SVGDefsUtils.offsetDiagonally(opts?.banded ? 0.25 : 0.5, getAngle());
                        const getCoords = createMemo(() =>
                            SVGUtils.getLinearCoords({ angle: getAngle(), scale: SCALE, offset: getOffset() }),
                        );

                        return SVGGradientDefsSolidUtils.computeLinearGradient(
                            {
                                id: `gradient1-${id}`,
                                colors: stopKeys.map((key) => ({ value: defs.colors[key] })),
                                spreadKind: opts?.banded ? "banded" : undefined,
                                angle: getAngle,
                                scale: SCALE,
                                offset: getOffset,
                            },
                            () => (
                                <>
                                    {SVGAnimations.Linear.sweepDiagonal(
                                        () => getCoords().x1,
                                        () => getCoords().y1,
                                        () => getCoords().x2,
                                        () => getCoords().y2,
                                        getAngle,
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
                        );
                    },
                },
                filter: opts?.banded ? undefined : SVGDefsSolidUtils.getBaseBlur(id, defs),
            },
        ];
    },
});
