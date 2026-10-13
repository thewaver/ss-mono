import { defineComponent } from "vue";

import { type GradientBandOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { Band1Const } from "@thewaver/ss-components/internal";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type BandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientBandOpts;
};

const BandGradient = defineComponent(
    (props: BandGradientProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );

        return () =>
            SVGGradientDefsVueUtils.computeLinearGradient({
                id: props.id,
                angle: 0,
                scale: Band1Const.BAND_SPAN,
                offset: {
                    x: (reading.value.boxRatio.x - 0.5) * (props.opts?.bandTravel ?? Band1Const.DEFAULTS.bandTravel),
                    y: 0,
                },
                colors: SVGDefsUtils.getFalloffStops(props.defs.colors.primary, {
                    coreStop: props.opts?.coreStop ?? Band1Const.DEFAULTS.coreStop,
                    coreAlpha: props.opts?.coreAlpha ?? Band1Const.DEFAULTS.coreAlpha,
                    falloffSpread: props.opts?.falloffSpread ?? Band1Const.DEFAULTS.falloffSpread,
                    falloffAlpha: props.opts?.falloffAlpha ?? Band1Const.DEFAULTS.falloffAlpha,
                }),
            });
    },
    {
        name: "BandGradient",
        props: declareProps<BandGradientProps>({ id: null, element: null, defs: null, opts: null }),
    },
);

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
            filter: SVGDefsVueUtils.getBaseBlur(id, defs),
        },
    ],
});
