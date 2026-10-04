import type {
    AccessorProps,
    PaintedTextStrokeAlignment,
    SVGDefsColors,
    SVGDefsSamples,
    SignalSource,
} from "@thewaver/ss-components-solid";
import type { Size2d } from "@thewaver/ss-utils";

import type { Paint } from "../../PageComponents/PaintPicker/PaintPicker.types";

export type PaintedTextExampleProps = AccessorProps<{
    fillPaint: Paint;
    strokePaint: Paint;
    strokeWidth: number;
    strokeAlignment: PaintedTextStrokeAlignment;
    colors: SVGDefsColors;
    blurWidth: number;
    animationDurationMs: number;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    cellSize: Size2d;
}>;

export type PaintedTextPathExampleProps = PaintedTextExampleProps &
    AccessorProps<{
        lapDurationMs: number;
        progress: SignalSource<number>;
        playback: SignalSource<boolean>;
    }>;

export type PaintedTextCircleExampleProps = PaintedTextPathExampleProps &
    AccessorProps<{
        radius: number;
        isFittedToPath: boolean;
    }>;
