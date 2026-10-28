import type { Signal } from "solid-js";

import type {
    AccessorProps,
    CellAnimationWeights,
    ScanlineAnimationOrientation,
    SignalSource,
} from "@thewaver/ss-components-solid";

export type ScanlineAnimationExampleProps = AccessorProps<{
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: CellAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playback: SignalSource<boolean>;
    progress?: Signal<number>;
}>;
