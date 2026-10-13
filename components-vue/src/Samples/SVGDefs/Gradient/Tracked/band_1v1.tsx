import { defineComponent } from "vue";

import { type GradientBandOpts, type PointSource, SVGDefsUtils } from "@thewaver/ss-components";
import { Band1v1Const } from "@thewaver/ss-components/internal";

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
    getPointSource?: () => PointSource | undefined;
};

const getBandColors = (color: string, opts?: GradientBandOpts) =>
    SVGDefsUtils.getFalloffStops(color, {
        coreStop: opts?.coreStop ?? Band1v1Const.DEFAULTS.coreStop,
        coreAlpha: opts?.coreAlpha ?? Band1v1Const.DEFAULTS.coreAlpha,
        falloffSpread: opts?.falloffSpread ?? Band1v1Const.DEFAULTS.falloffSpread,
        falloffAlpha: opts?.falloffAlpha ?? Band1v1Const.DEFAULTS.falloffAlpha,
    });

const BandGradient = defineComponent(
    (props: BandGradientProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.getPointSource?.(),
        );

        return () => {
            const travel =
                (reading.value.boxRatio[props.axis] - 0.5) *
                (props.opts?.bandTravel ?? Band1v1Const.DEFAULTS.bandTravel);

            return SVGGradientDefsVueUtils.computeLinearGradient({
                id: props.id,
                colors: getBandColors(props.color, props.opts),
                angle: props.axis === "x" ? 0 : 90,
                scale: Band1v1Const.BAND_SPAN,
                offset: props.axis === "x" ? { x: travel, y: 0 } : { x: 0, y: travel },
            });
        };
    },
    {
        name: "BandGradient",
        props: declareProps<BandGradientProps>({
            id: null,
            element: null,
            color: null,
            axis: null,
            opts: null,
            getPointSource: null,
        }),
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
                            getPointSource={defs.getPointSource}
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
                            getPointSource={defs.getPointSource}
                        />
                    ),
                },
                filter: sharedBlurRef,
                blend: true,
            },
        ];
    },
});
