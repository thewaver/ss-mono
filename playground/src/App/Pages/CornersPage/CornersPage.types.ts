import type { CornerKey } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type BaseCornersExampleValues = {
    color: string;
    cornerLength: Size2d;
    strokeThickness: number;
    transitionDurationMs: number;
    visibleCorners: Set<CornerKey>;
};

export type BaseCornersExampleProps = BaseCornersExampleValues;
