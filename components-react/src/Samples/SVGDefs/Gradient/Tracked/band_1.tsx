import { type GradientBandOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { Band1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type BandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientBandOpts;
};

const BandGradient = (props: BandGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.defs.getPointSource?.());

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        angle: 0,
        scale: Band1Const.BAND_SPAN,
        offset: {
            x: (reading.boxRatio.x - 0.5) * (props.opts?.bandTravel ?? Band1Const.DEFAULTS.bandTravel),
            y: 0,
        },
        colors: SVGDefsUtils.getFalloffStops(props.defs.colors.primary, {
            coreStop: props.opts?.coreStop ?? Band1Const.DEFAULTS.coreStop,
            coreAlpha: props.opts?.coreAlpha ?? Band1Const.DEFAULTS.coreAlpha,
            falloffSpread: props.opts?.falloffSpread ?? Band1Const.DEFAULTS.falloffSpread,
            falloffAlpha: props.opts?.falloffAlpha ?? Band1Const.DEFAULTS.falloffAlpha,
        }),
    });
};

export const band_1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => (
                    <BandGradient id={`gradient1-${id}`} element={element} defs={defs} opts={opts} />
                ),
            },
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
