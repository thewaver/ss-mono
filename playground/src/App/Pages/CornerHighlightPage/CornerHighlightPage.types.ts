import type { QuadCorner, Size2d } from "@thewaver/ss-utils";

export type BaseCornerHighlightExampleValues = {
    color: string;
    cornerLength: Size2d;
    strokeThickness: number;
    transitionDurationMs: number;
    visibleCorners: Set<QuadCorner>;
};

export type BaseCornerHighlightExampleProps = BaseCornerHighlightExampleValues;
