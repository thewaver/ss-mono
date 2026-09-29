import type { Store } from "@thewaver/ss-utils";

export type RotatorPhase = "still" | "idling" | "spinning" | "settling";

export type RotatorSpinDefs = {
    turns: number;
    jitterRatio: number;
};

export type RotatorState = {
    angle: number;
    spinPhase: Exclude<RotatorPhase, "idling">;
    isAwaitingTarget: boolean;
    isResting: boolean;
};

export type RotatorCoreDefs = {
    getIsDisabled: () => boolean;
    getStepCount: () => number;
    getSpinDurationMs: () => number;
    getSettleDurationMs: () => number;
    targetIndex: [get: () => number, set: (value: number) => void];
    computeSpinTarget: () => number | Promise<number>;
    computeSpinDefs?: (index: number, stepCount: number) => RotatorSpinDefs;
    computeStepLabel: (index: number, stepCount: number) => string;
    onSpinEnd?: (index: number) => void;
};

export type RotatorController = Store<RotatorState> & {
    spin: () => boolean;
    turnToTarget: (index: number) => void;
    startRest: (restDurationMs: number) => () => void;
    drift: (idleDelayMs: number | undefined, stepAngle: number) => () => void;
    stop: () => void;
};
