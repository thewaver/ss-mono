import type { Signal } from "solid-js";

import type {
    AccessorProps,
    ScanlineAnimationOrientation,
    SignalSource,
    SliceAnimationWeights,
} from "@thewaver/ss-components-solid";

export type ScanlineAnimationExampleProps = AccessorProps<{
    src: string;
    lineCount: number;
    orientation: ScanlineAnimationOrientation;
    weightType: SliceAnimationWeights.OriginFreeWeightType;
    animationDurationMs: number;
    animationIterationDelayMs: number;
    playback: SignalSource<boolean>;
    progress?: Signal<number>;
}>;
