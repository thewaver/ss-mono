import { defineComponent } from "vue";

import { type GradientHandOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { Hand1Const } from "@thewaver/ss-components/internal";
import { SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerVueUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsVueUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedGradientConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";

type HandPartProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandOpts;
};

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const HandGradient = defineComponent(
    (props: HandPartProps) => {
        const { reading, isPointerPresent } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );

        return () =>
            SVGGradientDefsVueUtils.computeLinearGradient({
                id: props.id,
                angle: reading.value.angle + Hand1Const.QUARTER_TURN,
                colors: computeSweepColors(
                    props.defs.colors.primary,
                    (props.opts?.peakAlpha ?? Hand1Const.DEFAULTS.peakAlpha) *
                        SVGDefsUtils.getPointerFade(reading.value, isPointerPresent.value),
                ),
            });
    },
    { name: "HandGradient", props: declareProps<HandPartProps>({ id: null, element: null, defs: null, opts: null }) },
);

const HandClip = defineComponent(
    (props: HandPartProps) => {
        const { reading } = PointerTrackerVueUtils.usePointerReading(
            () => props.element,
            false,
            () => props.defs.getPointSource?.(),
        );

        return () => {
            const sweepArc = props.opts?.sweepArc ?? Hand1Const.DEFAULTS.sweepArc;

            return (
                <SVGClipPath id={props.id}>
                    <path
                        d={SVGUtils.getArcPath(sweepArc, reading.value.angle - Hand1Const.HALF_TURN - sweepArc * 0.5)}
                    />
                </SVGClipPath>
            );
        };
    },
    { name: "HandClip", props: declareProps<HandPartProps>({ id: null, element: null, defs: null, opts: null }) },
);

export const hand_1 = (opts?: GradientHandOpts): TrackedGradientConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            color: SVGDefsUtils.getBaseBorderColor(defs),
        },
        {
            gradientOrPattern: {
                id: `gradient1-${id}`,
                renderDefsElement: () => (
                    <HandGradient id={`gradient1-${id}`} element={element} defs={defs} opts={opts} />
                ),
            },
            clipPath: {
                id: `clip1-${id}`,
                renderDefsElement: () => <HandClip id={`clip1-${id}`} element={element} defs={defs} opts={opts} />,
            },
            filter: SVGDefsVueUtils.getBaseBlur(id, defs),
        },
    ],
});
