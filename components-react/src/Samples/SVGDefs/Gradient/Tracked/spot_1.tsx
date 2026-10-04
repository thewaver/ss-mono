import {
    type GradientSpotOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";

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

const DEFAULTS = TrackedGradientDefaults.SPOT_DEFAULTS;

const SpotGradient = (props: SpotGradientProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.defs.getPointSource?.());

    const color = props.defs.colors.primary;

    return SVGGradientDefsReactUtils.computeRadialGradient({
        id: props.id,
        elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
        origin: reading.boxRatio,
        scale: props.opts?.glowScale ?? DEFAULTS.glowScale,
        colors: [
            { value: `rgb(from ${color} r g b / 1)` },
            {
                value: `rgb(from ${color} r g b / ${props.opts?.coreAlpha ?? DEFAULTS.coreAlpha})`,
                stop: props.opts?.coreStop ?? DEFAULTS.coreStop,
            },
            {
                value: `rgb(from ${color} r g b / ${props.opts?.falloffAlpha ?? DEFAULTS.falloffAlpha})`,
                stop: props.opts?.falloffStop ?? DEFAULTS.falloffStop,
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
