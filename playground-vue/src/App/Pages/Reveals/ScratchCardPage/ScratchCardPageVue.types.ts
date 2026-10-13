import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type {
    ExampleKey,
    ExampleProgress,
} from "@thewaver/ss-playground/App/Pages/Reveals/ScratchCardPage/ScratchCardPage.types";

export type ScratchCardExampleProps = {
    brushRadius: number;
    precision: number;
    softness: number;
    clearThreshold: number;
    onScratch: (clearedRatio: number) => void;
    onClear: () => void;
    computePoints?: (size: Size2d) => Point2d[];
};

export type ScratchCardWindowsExampleProps = Omit<ScratchCardExampleProps, "onScratch" | "onClear"> & {
    onWindowScratch: (index: number, clearedRatio: number) => void;
    onWindowClear: (index: number) => void;
};
