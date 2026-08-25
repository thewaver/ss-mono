import type { AccessorProps, SVGDefsColors, SVGDefsSamples, ShapeProps } from "@thewaver/ss-components";
import type { ShapeConst, Size2d } from "@thewaver/ss-utils";

export type ShapeExampleProps = Pick<ShapeProps, "lameExponents" | "joinRadii"> &
    AccessorProps<{
        shouldClipChildren?: boolean;
        shouldPadChildren?: boolean;
        blurWidth?: number;
        animationDurationMs: number;
        colors: SVGDefsColors;
        shapeKind: ShapeConst.DefaultShape;
        strokeConfigKey: SVGDefsSamples.Gradient.SampleKey;
        fillConfigKey: SVGDefsSamples.Pattern.SampleKey;
        iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
        cellSize: Size2d;
        edgeThicknesses: number[];
    }>;
