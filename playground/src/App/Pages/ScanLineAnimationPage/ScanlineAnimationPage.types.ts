import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

import type { CellAnimationWeights } from "../../Samples/CellAnimationWeights/CellAnimationWeights.const";

export type ScanlineAnimationExampleProps = AccessorProps<{
    src: string;
    lineCount: number;
    weightType: CellAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playbackSignal: Signal<boolean>;
}>;
