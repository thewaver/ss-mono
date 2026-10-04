import type {
    ShapeRevealPageOrigin,
    ShapeRevealPageShape,
    ShapeRevealRun,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";

export type ShapeRevealExampleProps = {
    shape: ShapeRevealPageShape;
    origin: ShapeRevealPageOrigin;
    durationMs: number;
    blur: number;
    onRun: (run: ShapeRevealRun) => void;
};
