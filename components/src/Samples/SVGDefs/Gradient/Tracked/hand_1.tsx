import { SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefs.utils";
import type { GradientHandOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";
import { TrackedGradientDefaults } from "../TrackedGradient.const";

const QUARTER_TURN = 90;
const HALF_TURN = 180;

const DEFAULTS = TrackedGradientDefaults.HAND_DEFAULTS;

const NO_REF = () => undefined;

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

export const hand_1 = (opts?: GradientHandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading, getIsPointerPresent } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        angle: () => getReading().angle + QUARTER_TURN,
                        colors: () =>
                            computeSweepColors(
                                defs.colors.primary,
                                (opts?.peakAlpha ?? DEFAULTS.peakAlpha) *
                                    SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
                            ),
                    });
                },
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return (
                        <clipPath id={`clip1-${id}`} clipPathUnits="objectBoundingBox">
                            <path
                                d={SVGUtils.getArcPath(
                                    opts?.sweepArc ?? DEFAULTS.sweepArc,
                                    getReading().angle - HALF_TURN - (opts?.sweepArc ?? DEFAULTS.sweepArc) * 0.5,
                                )}
                            />
                        </clipPath>
                    );
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
