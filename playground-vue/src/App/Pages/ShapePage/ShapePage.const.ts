import { SVGDefsSamples } from "@thewaver/ss-components-vue";
import type { SVGDefs } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { Size2d } from "@thewaver/ss-utils";

import type { ShapeExampleProps } from "./ShapePage.types";

type StrokeFlags = Parameters<ReturnType<typeof SVGDefsSamples.Gradient.Timed.toConfig>["computeSVGDefs"]>[1];

const computeTiming = (props: ShapeExampleProps) => ({
    animationDurationMs: props.animationDurationMs,
    colors: props.colors,
    blurWidth: props.blurWidth,
    ...SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey].computeDefs(props.animationDurationMs),
});

export const computeShapeStrokeDefs = (
    id: string,
    props: ShapeExampleProps,
    size: Size2d,
    element: HTMLElement | undefined,
    flags?: StrokeFlags,
): SVGDefs[] => {
    const strokeKey = props.strokeConfigKey;

    if (strokeKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "stroke");

    return SVGDefsSamples.Gradient.Timed.toConfig({
        family: strokeKey,
        defs: props.strokeConfigDefs,
    } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, flags, element, {
        getSize: () => size,
        ...computeTiming(props),
    });
};

export const computeShapeFillDefs = (
    id: string,
    props: ShapeExampleProps,
    size: Size2d,
    element: HTMLElement | undefined,
    cellScale = 1,
): SVGDefs[] => {
    const fillKey = props.fillConfigKey;

    if (fillKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "fill");

    const cellSize = props.cellSize;

    return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[fillKey].computeSVGDefs(`fill-${id}`, undefined, element, {
        getSize: () => size,
        cellSize: { width: cellSize.width * cellScale, height: cellSize.height * cellScale },
        ...computeTiming(props),
    });
};
