import { type GradientHandOpts, SVGDefsUtils, TrackedGradientDefaults } from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerSolidUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSolid.utils";
import { SVGGradientDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSolid.utils";
import type { TrackedGradientConfig } from "../../SVGDefsSolid.types";
import { SVGDefsSolidUtils } from "../../SVGDefsSolid.utils";

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
                    const { getReading, getIsPointerPresent } = PointerTrackerSolidUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsSolidUtils.computeLinearGradient({
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
                    const { getReading } = PointerTrackerSolidUtils.create(getRef ?? NO_REF);

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
            filter: SVGDefsSolidUtils.getBaseBlur(id, defs),
        },
    ],
});
