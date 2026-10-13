import type {
    BasePaintedTextBoxedExampleProps,
    BasePaintedTextExampleProps,
} from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.types";

export type PaintedTextExampleProps = BasePaintedTextExampleProps;

export type PaintedTextBoxedExampleProps = BasePaintedTextBoxedExampleProps;

export type PaintedTextPathExampleProps = PaintedTextBoxedExampleProps & {
    lapDurationMs: number;
    progress: readonly [number, (value: number) => void];
    playback: readonly [boolean, (value: boolean) => void];
};

export type PaintedTextCircleExampleProps = PaintedTextPathExampleProps & {
    radius: number;
    isFittedToPath: boolean;
};
