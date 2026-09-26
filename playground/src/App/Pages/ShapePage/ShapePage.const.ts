import { SVGDefsSamples, access } from "@thewaver/ss-components";
import type { SVGDefs } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { NO_SAMPLE_KEY, computeNoSampleDefs } from "../../PageComponents/SampleGroups/SampleGroups.const";
import type { ShapeExampleProps } from "./ShapePage.types";

type StrokeFlags = Parameters<ReturnType<typeof SVGDefsSamples.Gradient.Timed.toConfig>["computeSVGDefs"]>[1];

const computeTiming = (props: ShapeExampleProps) => ({
    animationDurationMs: access(props.animationDurationMs),
    colors: access(props.colors),
    blurWidth: access(props.blurWidth),
    ...SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(props.iterationConfigKey)].computeDefs(
        access(props.animationDurationMs),
    ),
});

export const computeShapeStrokeDefs = (
    id: string,
    props: ShapeExampleProps,
    getSize: () => Size2d,
    getRef: () => HTMLElement | undefined,
    getFlags?: StrokeFlags,
): SVGDefs[] => {
    const strokeKey = access(props.strokeConfigKey);

    if (strokeKey === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), "stroke");

    return SVGDefsSamples.Gradient.Timed.toConfig({
        family: strokeKey,
        defs: access(props.strokeConfigDefs),
    } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, getFlags, getRef, {
        getSize,
        ...computeTiming(props),
    });
};

export const computeShapeFillDefs = (
    id: string,
    props: ShapeExampleProps,
    getSize: () => Size2d,
    getRef: () => HTMLElement | undefined,
    cellScale = 1,
): SVGDefs[] => {
    const fillKey = access(props.fillConfigKey);

    if (fillKey === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), "fill");

    const cellSize = access(props.cellSize);

    return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[fillKey].computeSVGDefs(`fill-${id}`, undefined, getRef, {
        getSize,
        cellSize: { width: cellSize.width * cellScale, height: cellSize.height * cellScale },
        ...computeTiming(props),
    });
};
