import type { Point2d, ShapeConst, Size2d } from "@thewaver/ss-utils";

export type RevealShape = "circle" | ShapeConst.DefaultShape;

export type RevealExampleProps = {
    radius: () => number;
    softness: () => number;
    stepSize: () => number;
    joinRadii: () => number[];
    lameExponents: () => number[];
    isDisabled: () => boolean;
    computePoints: () => ((size: Size2d) => Point2d[]) | undefined;
};
