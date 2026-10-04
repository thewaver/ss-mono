import {
    type GradientBandOpts,
    type PointSource,
    SVGDefsUtils,
    TrackedGradientDefaults,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type BandAxis = "x" | "y";

type BandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    color: string;
    axis: BandAxis;
    source: PointSource | undefined;
    opts?: GradientBandOpts;
};

const BAND_SPAN: Size2d = { width: 0.7, height: 0.7 };

const DEFAULTS = TrackedGradientDefaults.BAND_BLEND_DEFAULTS;

const getBandColors = (color: string, opts?: GradientBandOpts) =>
    SVGDefsUtils.getFalloffStops(color, {
        coreStop: opts?.coreStop ?? DEFAULTS.coreStop,
        coreAlpha: opts?.coreAlpha ?? DEFAULTS.coreAlpha,
        falloffSpread: opts?.falloffSpread ?? DEFAULTS.falloffSpread,
        falloffAlpha: opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
    });

const BandGradient = (props: BandGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.source);

    const travel = (reading.boxRatio[props.axis] - 0.5) * (props.opts?.bandTravel ?? DEFAULTS.bandTravel);

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        colors: getBandColors(props.color, props.opts),
        angle: props.axis === "x" ? 0 : 90,
        scale: BAND_SPAN,
        offset: props.axis === "x" ? { x: travel, y: 0 } : { x: 0, y: travel },
    });
};

export const band_1v1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsReactUtils.getBaseBlur(id, defs);
        const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

        return [
            {
                color: SVGDefsUtils.getBaseBorderColor(defs),
            },
            {
                gradientOrPattern: {
                    id: `gradient1-${id}`,
                    renderDefsElement: () => (
                        <BandGradient
                            id={`gradient1-${id}`}
                            element={element}
                            color={defs.colors.primary}
                            axis="x"
                            source={defs.getPointSource?.()}
                            opts={opts}
                        />
                    ),
                },
                filter: sharedBlur,
                blend: true,
            },
            {
                gradientOrPattern: {
                    id: `gradient2-${id}`,
                    renderDefsElement: () => (
                        <BandGradient
                            id={`gradient2-${id}`}
                            element={element}
                            color={defs.colors.secondary}
                            axis="y"
                            source={defs.getPointSource?.()}
                            opts={opts}
                        />
                    ),
                },
                filter: sharedBlurRef,
                blend: true,
            },
        ];
    },
});
