import type { SVGDefsColors, SVGDefsSamples, ShapeProps } from "@thewaver/ss-components-react";
import type { WithNoSample } from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.types";
import type { ShapeConst, Size2d } from "@thewaver/ss-utils";

export type ShapeExampleProps = Pick<ShapeProps, "lameExponents" | "joinRadii"> & {
    shouldClipChildren?: boolean;
    shouldPadChildren?: boolean;
    blurWidth?: number;
    animationDurationMs: number;
    colors: SVGDefsColors;
    shapeKind: ShapeConst.DefaultShape;
    strokeConfigKey: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>;
    strokeConfigDefs: Record<string, number | boolean>;
    fillConfigKey: WithNoSample<SVGDefsSamples.Pattern.SampleKey>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    cellSize: Size2d;
    edgeThicknesses: number[];
};
