import type { PaintedTextStrokeAlignment, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-react";
import type { Size2d } from "@thewaver/ss-utils";

import type { Paint } from "../../PageComponents/PaintPicker/PaintPicker.types";

export type PaintedTextExampleProps = {
    fillPaint: Paint;
    strokePaint: Paint;
    strokeWidth: number;
    strokeAlignment: PaintedTextStrokeAlignment;
    colors: SVGDefsColors;
    blurWidth: number;
    animationDurationMs: number;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    cellSize: Size2d;
};
