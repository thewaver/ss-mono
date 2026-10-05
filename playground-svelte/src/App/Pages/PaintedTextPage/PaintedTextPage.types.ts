import type { PaintedTextStrokeAlignment, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-svelte";
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

export type PaintedTextExampleWrapperProps = PaintedTextExampleProps & {
    width: number;
};

export type PaintedTextBoxedExampleProps = PaintedTextExampleProps & {
    width?: number;
};

export type PaintedTextPathExampleProps = PaintedTextBoxedExampleProps & {
    lapDurationMs: number;
    progress: number;
    playback: boolean;
};

export type PaintedTextCircleExampleProps = PaintedTextPathExampleProps & {
    radius: number;
    isFittedToPath: boolean;
};

export type PaintedTextPathExampleWrapperProps = PaintedTextExampleWrapperProps & {
    progress: number;
    playback: boolean;
};
