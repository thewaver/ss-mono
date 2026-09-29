import {
    type GradientBandOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

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

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

const DEFAULTS = TrackedGradientDefaults.BAND_DIAGONAL_DEFAULTS;

const DiagonalBandGradient = (props: DiagonalBandGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref);

    const angle = props.opts?.bandAngle ?? DEFAULTS.bandAngle;
    const travel =
        SVGDefsUtils.projectBoxRatioOntoAngle(reading.boxRatio, angle) *
        (props.opts?.bandTravel ?? DEFAULTS.bandTravel);

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        colors: SVGDefsUtils.getFalloffStops(props.defs.colors.primary, {
            coreStop: props.opts?.coreStop ?? DEFAULTS.coreStop,
            coreAlpha: props.opts?.coreAlpha ?? DEFAULTS.coreAlpha,
            falloffSpread: props.opts?.falloffSpread ?? DEFAULTS.falloffSpread,
            falloffAlpha: props.opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
        }),
        angle,
        scale: BAND_SPAN,
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
