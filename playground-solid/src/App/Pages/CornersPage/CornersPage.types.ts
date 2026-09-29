import type { AccessorProps, CornerKey } from "@thewaver/ss-components-solid";
import type { Size2d } from "@thewaver/ss-utils";

export type CornersExampleProps = AccessorProps<{
    color: string;
    cornerLength: Size2d;
    strokeThickness: number;
    transitionDurationMs: number;
    visibleCorners: Set<CornerKey>;
}>;
