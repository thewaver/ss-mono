import type { Point2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type ShapeRevealShape = "circle" | ShapeConst.DefaultShape;

export type ShapeRevealExampleProps = {
    durationMs: () => number;
    delayMs: () => number;
    computePoints: () => ((size: Size2d) => Point2d[]) | undefined;
    softness: () => number;
    startDegrees: () => number;
    endDegrees: () => number;
};
