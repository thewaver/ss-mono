import type { RotatorSpinDefs } from "@thewaver/ss-components";

import type { AccessorValues, SignalSource } from "../../Utils/typeUtils";

export type RotatorDefs = AccessorValues<{
    stepCount: number;
    spinDurationMs?: number;
    settleDurationMs?: number;
    restDurationMs?: number;
    idleDelayMs?: number;
}> & {
    computeSpinTarget: () => number | Promise<number>;
    computeSpinDefs?: (index: number, stepCount: number) => RotatorSpinDefs;
    computeStepLabel: (index: number, stepCount: number) => string;
    targetIndex?: SignalSource<number>;
    autoSpin?: SignalSource<boolean>;
    onStepChange?: (index: number) => void;
    onSpinEnd?: (index: number) => void;
};
