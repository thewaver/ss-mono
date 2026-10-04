import type { AccessorProps } from "@thewaver/ss-components-solid";
import type {
    ShapeRevealPageOrigin,
    ShapeRevealPageShape,
    ShapeRevealRun,
} from "@thewaver/ss-playground/App/Pages/ShapeRevealPage/ShapeRevealPage.types";

export type ShapeRevealExampleProps = AccessorProps<{
    shape: ShapeRevealPageShape;
    origin: ShapeRevealPageOrigin;
    durationMs: number;
    blur: number;
    onRun: (run: ShapeRevealRun) => void;
}>;
