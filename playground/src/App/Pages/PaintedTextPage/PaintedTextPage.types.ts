import type { PaintedTextStrokeAlignment, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { Paint } from "../../PageComponents/PaintPicker/PaintPicker.types";

export type BasePaintedTextExampleValues = {
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

export type BasePaintedTextExampleProps = BasePaintedTextExampleValues;

export type BasePaintedTextBoxedExampleValues = {
    width?: number;
};

export type BasePaintedTextBoxedExampleProps = BasePaintedTextExampleProps & BasePaintedTextBoxedExampleValues;
