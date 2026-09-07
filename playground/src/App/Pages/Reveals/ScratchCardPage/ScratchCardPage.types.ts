import type { AccessorProps } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type ScratchCardExampleProps = AccessorProps<{
    brushRadius: number;
    precision: number;
    softness: number;
    clearThreshold: number;
    onScratch: (clearedRatio: number) => void;
    onClear: () => void;
}> & {
    computePoints: () => ((size: Size2d) => Point2d[]) | undefined;
};

export type ExampleKey = "ticket" | "frosted";

export type ExampleProgress = {
    ratio: number;
    hasCleared: boolean;
};
