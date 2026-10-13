import type {
    BasePaintedTextBoxedExampleProps,
    BasePaintedTextExampleProps,
} from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.types";

export type PaintedTextExampleProps = BasePaintedTextExampleProps;

export type PaintedTextExampleWrapperProps = PaintedTextExampleProps & {
    width: number;
};

export type PaintedTextBoxedExampleProps = BasePaintedTextBoxedExampleProps;

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
