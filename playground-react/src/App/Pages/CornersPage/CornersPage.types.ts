import type { CornerKey } from "@thewaver/ss-components-react";
import type { Size2d } from "@thewaver/ss-utils";

export type CornersExampleProps = {
    color: string;
    cornerLength: Size2d;
    strokeThickness: number;
    transitionDurationMs: number;
    visibleCorners: Set<CornerKey>;
};
