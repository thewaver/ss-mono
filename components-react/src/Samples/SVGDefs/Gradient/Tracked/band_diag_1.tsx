import { type GradientBandOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { BandDiag1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type DiagonalBandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientBandOpts;
};

const DiagonalBandGradient = (props: DiagonalBandGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.defs.getPointSource?.());

    const angle = props.opts?.bandAngle ?? BandDiag1Const.DEFAULTS.bandAngle;
    const travel =
        SVGDefsUtils.projectBoxRatioOntoAngle(reading.boxRatio, angle) *
        (props.opts?.bandTravel ?? BandDiag1Const.DEFAULTS.bandTravel);

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        colors: SVGDefsUtils.getFalloffStops(props.defs.colors.primary, {
            coreStop: props.opts?.coreStop ?? BandDiag1Const.DEFAULTS.coreStop,
            coreAlpha: props.opts?.coreAlpha ?? BandDiag1Const.DEFAULTS.coreAlpha,
            falloffSpread: props.opts?.falloffSpread ?? BandDiag1Const.DEFAULTS.falloffSpread,
            falloffAlpha: props.opts?.falloffAlpha ?? BandDiag1Const.DEFAULTS.falloffAlpha,
        }),
        angle,
        scale: BandDiag1Const.BAND_SPAN,
        offset: SVGDefsUtils.offsetDiagonally(travel, angle),
    });
};

export const band_diag_1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => (
                    <DiagonalBandGradient id={`gradient1-${id}`} element={element} defs={defs} opts={opts} />
                ),
            },
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
