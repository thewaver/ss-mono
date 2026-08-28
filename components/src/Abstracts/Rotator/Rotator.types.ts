import type { Signal } from "solid-js";

import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type RotatorPhase = "still" | "idling" | "spinning" | "settling";

export type RotatorSpinDefs = {
    turns: number;
    jitterRatio: number;
};

export type RotatorDefs = AccessorProps<{
    stepCount: number;
    spinDurationMs?: number;
    settleDurationMs?: number;
    restDurationMs?: number;
    computeSpinTarget: () => number | Promise<number>;
    computeSpinDefs?: (index: number, stepCount: number) => RotatorSpinDefs;
    computeStepLabel?: (index: number, stepCount: number) => string;
    indexSignal?: Signal<number>;
    autoSpinSignal?: Signal<boolean>;
    onStepChange?: (index: number) => void;
    onSpinEnd?: (index: number) => void;
}> & {
    idleDelayMs?: MaybeAccessor<number | undefined>;
};
