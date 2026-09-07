import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type RevealExampleProps = {
    radius: () => number;
    softness: () => number;
    joinRadii: () => number[];
    lameExponents: () => number[];
    isDisabled: () => boolean;
    computePoints: () => ((size: Size2d) => Point2d[]) | undefined;
};
