import { type GradientHandOpts, SVGDefsUtils, type TrackedGradientElementDefs } from "@thewaver/ss-components";
import { Hand1Const } from "@thewaver/ss-components/internal";
import { SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGClipPath } from "../../../../Generators/SVGDefs/SVGClipPaths/SVGClipPath";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

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

const HandGradient = (props: HandPartProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(
        ref,
        false,
        props.defs.getPointSource?.(),
    );

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        angle: reading.angle + Hand1Const.QUARTER_TURN,
        colors: computeSweepColors(
            props.defs.colors.primary,
            (props.opts?.peakAlpha ?? Hand1Const.DEFAULTS.peakAlpha) *
                SVGDefsUtils.getPointerFade(reading, isPointerPresent),
        ),
    });
};

const HandClip = (props: HandPartProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref, false, props.defs.getPointSource?.());

    const sweepArc = props.opts?.sweepArc ?? Hand1Const.DEFAULTS.sweepArc;

    return (
        <SVGClipPath id={props.id}>
            <path d={SVGUtils.getArcPath(sweepArc, reading.angle - Hand1Const.HALF_TURN - sweepArc * 0.5)} />
        </SVGClipPath>
    );
};

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
            filter: SVGDefsReactUtils.getBaseBlur(id, defs),
        },
    ],
});
