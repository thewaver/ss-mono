import { defineComponent } from "vue";

import { type GradientSpotOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { Spot1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type SpotGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientSpotOpts;
};

const SpotGradient = defineComponent(
    (props: SpotGradientProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );

        return () => {
            const color = props.defs.colors.primary;

            return SVGGradientDefsVueUtils.computeRadialGradient({
                id: props.id,
                elementSize: (props.opts?.circular ?? Spot1Const.DEFAULTS.circular) ? props.defs.getSize() : undefined,
                origin: reading.value.boxRatio,
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
    },
    {
        name: "SpotGradient",
        props: declareProps<SpotGradientProps>({ id: null, element: null, defs: null, opts: null }),
    },
);

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
            filter: SVGDefsVueUtils.getBaseBlur(id, defs),
        },
    ],
});
