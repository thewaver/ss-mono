import { type GradientBandOpts, type PointSource, SVGDefsUtils } from "@thewaver/ss-components";
import { Band1v1Const } from "@thewaver/ss-components/internal";

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

const getBandColors = (color: string, opts?: GradientBandOpts) =>
    SVGDefsUtils.getFalloffStops(color, {
        coreStop: opts?.coreStop ?? Band1v1Const.DEFAULTS.coreStop,
        coreAlpha: opts?.coreAlpha ?? Band1v1Const.DEFAULTS.coreAlpha,
        falloffSpread: opts?.falloffSpread ?? Band1v1Const.DEFAULTS.falloffSpread,
        falloffAlpha: opts?.falloffAlpha ?? Band1v1Const.DEFAULTS.falloffAlpha,
    });

const BandGradient = (props: BandGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.source);

    const travel = (reading.boxRatio[props.axis] - 0.5) * (props.opts?.bandTravel ?? Band1v1Const.DEFAULTS.bandTravel);

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        colors: getBandColors(props.color, props.opts),
        angle: props.axis === "x" ? 0 : 90,
        scale: Band1v1Const.BAND_SPAN,
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
