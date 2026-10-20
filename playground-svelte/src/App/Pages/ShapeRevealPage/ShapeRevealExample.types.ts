import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type ShapeRevealExampleProps = {
    durationMs: number;
    delayMs: number;
    computePoints?: (size: Size2d) => Point2d[];
    softness: number;
    startDegrees: number;
    endDegrees: number;
};
