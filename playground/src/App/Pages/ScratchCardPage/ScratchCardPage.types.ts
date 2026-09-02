import type { AccessorProps } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type ScratchCardExampleProps = AccessorProps<{
    cellCount: Point2d;
    brushRadius: number;
    clearThreshold: number;
    onScratch: (clearedRatio: number) => void;
    onClear: () => void;
}>;
