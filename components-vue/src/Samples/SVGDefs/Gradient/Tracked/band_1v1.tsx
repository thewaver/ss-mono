import { defineComponent } from "vue";

import { type GradientBandOpts, SVGDefsUtils, TrackedGradientDefaults } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type BandAxis = "x" | "y";

type BandGradientProps = {
    id: string;
    element: HTMLElement | undefined;
    color: string;
    axis: BandAxis;
    opts?: GradientBandOpts;
};

const BAND_SPAN: Size2d = { width: 0.7, height: 0.7 };

const DEFAULTS = TrackedGradientDefaults.BAND_BLEND_DEFAULTS;

const getBandColors = (color: string, opts?: GradientBandOpts) =>
    SVGDefsUtils.getFalloffStops(color, {
        coreStop: opts?.coreStop ?? DEFAULTS.coreStop,
        coreAlpha: opts?.coreAlpha ?? DEFAULTS.coreAlpha,
        falloffSpread: opts?.falloffSpread ?? DEFAULTS.falloffSpread,
        falloffAlpha: opts?.falloffAlpha ?? DEFAULTS.falloffAlpha,
    });

const BandGradient = defineComponent(
    (props: BandGradientProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(() => props.element);

        return () => {
            const travel = (reading.value.boxRatio[props.axis] - 0.5) * (props.opts?.bandTravel ?? DEFAULTS.bandTravel);

            return SVGGradientDefsVueUtils.computeLinearGradient({
                id: props.id,
                colors: getBandColors(props.color, props.opts),
                angle: props.axis === "x" ? 0 : 90,
                scale: BAND_SPAN,
                offset: props.axis === "x" ? { x: travel, y: 0 } : { x: 0, y: travel },
            });
        };
    },
    {
        name: "BandGradient",
        props: declareProps<BandGradientProps>({ id: null, element: null, color: null, axis: null, opts: null }),
    },
);

export const band_1v1 = (opts?: GradientBandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => {
        const sharedBlur = SVGDefsVueUtils.getBaseBlur(id, defs);
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
