import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerUtils } from "../../../../Abstracts/PointerTracker/PointerTracker.utils";
import { SVGGradientDefsUtils } from "../../../../Abstracts/SVG/Defs/Gradient/SVGGradientDefs.utils";
import type { GradientBandOpts, TrackedGradientConfig } from "../../SVGDefs.types";
import { SVGDefsUtils } from "../../SVGDefs.utils";

const BAND_SPAN: Size2d = { width: 0.7, height: 0.7 };
const BAND_TRAVEL = 1;
const CORE_STOP = 50;
const FALLOFF_SPREAD = 25;
const CORE_ALPHA = 0.5;
const FALLOFF_ALPHA = 0.15;

const NO_REF = () => undefined;

const getBandColors = (color: string, opts?: GradientBandOpts) => {
    const coreStop = opts?.coreStop ?? CORE_STOP;
    const spread = opts?.falloffSpread ?? FALLOFF_SPREAD;
    const falloffAlpha = opts?.falloffAlpha ?? FALLOFF_ALPHA;

    return [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / ${falloffAlpha})`, stop: coreStop - spread },
        { value: `rgb(from ${color} r g b / ${opts?.coreAlpha ?? CORE_ALPHA})`, stop: coreStop },
        { value: `rgb(from ${color} r g b / ${falloffAlpha})`, stop: coreStop + spread },
        { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
    ];
};

export const band_1v1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient1-${id}`,
                        colors: getBandColors(defs.colors.primary, opts),
                        angle: 0,
                        scale: BAND_SPAN,
                        offset: () => ({
                            x: (getReading().boxRatio.x - 0.5) * (opts?.bandTravel ?? BAND_TRAVEL),
                            y: 0,
                        }),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
            blend: true,
        },
        {
            gradientOrPattern: {
                id: `gradient2-${id}`,
                renderDefsElement: () => {
                    const { getReading } = PointerTrackerUtils.create(getRef ?? NO_REF);

                    return SVGGradientDefsUtils.computeLinearGradient({
                        id: `gradient2-${id}`,
                        colors: getBandColors(defs.colors.secondary, opts),
                        angle: 90,
                        scale: BAND_SPAN,
                        offset: () => ({ x: 0, y: (getReading().boxRatio.y - 0.5) * BAND_TRAVEL }),
                    });
                },
            },
            filter: SVGDefsUtils.getBaseBlur(id, defs),
            blend: true,
        },
    ],
});
