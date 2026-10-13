import { type GradientSpotOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { Spot1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type SpotGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotOpts;
};

const SpotGradient = (props: SpotGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.defs.getPointSource?.());

    const color = props.defs.colors.primary;

    return SVGGradientDefsReactUtils.computeRadialGradient({
        id: props.id,
        elementSize: (props.opts?.circular ?? Spot1Const.DEFAULTS.circular) ? props.defs.getSize() : undefined,
        origin: reading.boxRatio,
        scale: props.opts?.glowScale ?? Spot1Const.DEFAULTS.glowScale,
        colors: [
            { value: `rgb(from ${color} r g b / 1)` },
            {
                value: `rgb(from ${color} r g b / ${props.opts?.coreAlpha ?? Spot1Const.DEFAULTS.coreAlpha})`,
                stop: props.opts?.coreStop ?? Spot1Const.DEFAULTS.coreStop,
            },
            {
                value: `rgb(from ${color} r g b / ${props.opts?.falloffAlpha ?? Spot1Const.DEFAULTS.falloffAlpha})`,
                stop: props.opts?.falloffStop ?? Spot1Const.DEFAULTS.falloffStop,
            },
            { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
        ],
    });
};

export const spot_1 = (opts?: GradientSpotOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => (
                    <SpotGradient id={`gradient1-${id}`} element={element} defs={defs} opts={opts} />
                ),
            },
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
