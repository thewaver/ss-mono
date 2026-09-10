import { SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

const SWEEP_ARC = 90;
const SWEEP_LEAD = 90;
const HALF_TURN = 180;
const PEAK_ALPHA = 1;

const NO_REF = () => undefined;

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

export const hand_1 = (): TrackedGradientConfig => ({
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
                        angle: () => getReading().angle + SWEEP_LEAD,
                        colors: () =>
                            computeSweepColors(
                                defs.colors.primary,
                                PEAK_ALPHA * SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()),
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
                                d={SVGUtils.getArcPath(SWEEP_ARC, getReading().angle - HALF_TURN - SWEEP_ARC * 0.5)}
                            />
                        </clipPath>
                    );
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
        },
    ],
});
