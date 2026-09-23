import type { Signal } from "solid-js";

import type { AccessorProps, CellAnimationWeights, ScanlineAnimationOrientation } from "@thewaver/ss-components";

export type ScanlineAnimationExampleProps = AccessorProps<{
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: CellAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playbackSignal: Signal<boolean>;
}>;
