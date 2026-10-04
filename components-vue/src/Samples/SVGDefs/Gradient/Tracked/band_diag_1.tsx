import { defineComponent } from "vue";

import {
    type GradientBandOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type DiagonalBandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientBandOpts;
};

const BAND_SPAN: Size2d = { width: 0.8, height: 0.8 };

const DEFAULTS = TrackedGradientDefaults.BAND_DIAGONAL_DEFAULTS;

const DiagonalBandGradient = defineComponent(
    (props: DiagonalBandGradientProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );

        return () => {
            const angle = props.opts?.bandAngle ?? DEFAULTS.bandAngle;
            const travel =
                SVGDefsUtils.projectBoxRatioOntoAngle(reading.value.boxRatio, angle) *
                (props.opts?.bandTravel ?? DEFAULTS.bandTravel);

            return SVGGradientDefsVueUtils.computeLinearGradient({
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
    },
    {
        name: "DiagonalBandGradient",
        props: declareProps<DiagonalBandGradientProps>({ id: null, element: null, defs: null, opts: null }),
    },
);

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
            filter: SVGDefsVueUtils.getBaseBlur(id, defs),
        },
    ],
});
