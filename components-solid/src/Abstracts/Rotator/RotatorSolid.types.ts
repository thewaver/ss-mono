import type { RotatorSpinDefs } from "@thewaver/ss-components";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type RotatorDefs = AccessorProps<{
    stepCount: number;
    spinDurationMs?: number;
    settleDurationMs?: number;
    restDurationMs?: number;
    computeSpinTarget: () => number | Promise<number>;
    computeSpinDefs?: (index: number, stepCount: number) => RotatorSpinDefs;
    computeStepLabel: (index: number, stepCount: number) => string;
    targetIndex?: SignalSource<number>;
    autoSpin?: SignalSource<boolean>;
    onStepChange?: (index: number) => void;
    onSpinEnd?: (index: number) => void;
}> & {
    idleDelayMs?: MaybeAccessor<number | undefined>;
};
