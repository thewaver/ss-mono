import type { AccessorProps, AccessorValues, SignalSource } from "@thewaver/ss-components-solid";
import type {
    BasePaintedTextBoxedExampleValues,
    BasePaintedTextExampleValues,
} from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.types";

export type PaintedTextExampleProps = AccessorValues<BasePaintedTextExampleValues>;

export type PaintedTextBoxedExampleProps = PaintedTextExampleProps & AccessorValues<BasePaintedTextBoxedExampleValues>;

export type PaintedTextPathExampleProps = PaintedTextBoxedExampleProps &
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
