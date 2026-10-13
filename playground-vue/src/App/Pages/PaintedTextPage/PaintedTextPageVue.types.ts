import type {
    BasePaintedTextBoxedExampleProps,
    BasePaintedTextExampleProps,
} from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.types";

export type PaintedTextExampleProps = BasePaintedTextExampleProps;

export type PaintedTextExampleWrapperProps = PaintedTextExampleProps & {
    width: number;
};

export type PaintedTextPlaybackProps = {
    "progress": number;
    "onUpdate:progress"?: (value: number) => void;
    "playback": boolean;
    "onUpdate:playback"?: (value: boolean) => void;
};

export type PaintedTextBoxedExampleProps = BasePaintedTextBoxedExampleProps;

export type PaintedTextPathExampleProps = PaintedTextBoxedExampleProps &
    PaintedTextPlaybackProps & {
        lapDurationMs: number;
    };

export type PaintedTextCircleExampleProps = PaintedTextPathExampleProps & {
    radius: number;
    isFittedToPath: boolean;
};

export type PaintedTextPathExampleWrapperProps = PaintedTextExampleWrapperProps & PaintedTextPlaybackProps;
