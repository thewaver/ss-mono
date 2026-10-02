import type { AccessorProps, SVGDefsColors, SVGDefsSamples, ShapeProps } from "@thewaver/ss-components-solid";
import type { ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { Paint } from "../../PageComponents/PaintPicker/PaintPicker.types";

export type ShapeExampleProps = Pick<ShapeProps, "lameExponents" | "joinRadii"> &
    AccessorProps<{
        shouldClipChildren?: boolean;
        shouldPadChildren?: boolean;
        blurWidth?: number;
        animationDurationMs: number;
        colors: SVGDefsColors;
        shapeKind: ShapeConst.DefaultShape;
        strokePaint: Paint;
        fillPaint: Paint;
        iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
        cellSize: Size2d;
        edgeThicknesses: number[];
    }>;
