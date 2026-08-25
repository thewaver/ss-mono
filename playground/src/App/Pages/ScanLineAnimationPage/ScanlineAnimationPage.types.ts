import type { Signal } from "solid-js";

import type { AccessorProps, CellAnimationWeights } from "@thewaver/ss-components";

export type ScanlineAnimationExampleProps = AccessorProps<{
    src: string;
    lineCount: number;
    weightType: CellAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playbackSignal: Signal<boolean>;
}>;
