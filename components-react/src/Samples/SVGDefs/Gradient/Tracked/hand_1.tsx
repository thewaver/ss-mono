import {
    type GradientHandOpts,
    SVGDefsUtils,
    TrackedGradientDefaults,
    type TrackedGradientElementDefs,
} from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { PointerTrackerReactUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerReact.utils";
import { SVGGradientDefsReactUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsReact.utils";
import type { TrackedGradientConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";

type HandPartProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedGradientElementDefs;
    opts?: GradientHandOpts;
};

const QUARTER_TURN = 90;
const HALF_TURN = 180;

const DEFAULTS = TrackedGradientDefaults.HAND_DEFAULTS;

const computeSweepColors = (color: string, alpha: number) => [
    { value: `rgb(from ${color} r g b / 0)` },
    { value: `rgb(from ${color} r g b / ${alpha})` },
    { value: `rgb(from ${color} r g b / 0)` },
];

const HandGradient = (props: HandPartProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading, isPointerPresent } = PointerTrackerReactUtils.usePointerReading(ref);

    return SVGGradientDefsReactUtils.computeLinearGradient({
        id: props.id,
        angle: reading.angle + QUARTER_TURN,
        colors: computeSweepColors(
            props.defs.colors.primary,
            (props.opts?.peakAlpha ?? DEFAULTS.peakAlpha) * SVGDefsUtils.getPointerFade(reading, isPointerPresent),
        ),
    });
};

const HandClip = (props: HandPartProps) => {
    const ref = SVGDefsReactUtils.useElementRef(props.element);
    const { reading } = PointerTrackerReactUtils.usePointerReading(ref);

    const sweepArc = props.opts?.sweepArc ?? DEFAULTS.sweepArc;

    return (
        <clipPath id={props.id} clipPathUnits="objectBoundingBox">
            <path d={SVGUtils.getArcPath(sweepArc, reading.angle - HALF_TURN - sweepArc * 0.5)} />
        </clipPath>
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
