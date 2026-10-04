import { defineComponent } from "vue";

import {
    type GradientSpotOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";

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

const DEFAULTS = TrackedGradientDefaults.SPOT_DEFAULTS;

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
                elementSize: (props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined,
                origin: reading.value.boxRatio,
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
