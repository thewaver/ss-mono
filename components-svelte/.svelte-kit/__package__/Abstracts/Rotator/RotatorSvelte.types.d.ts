import type { RotatorSpinDefs } from "@thewaver/ss-components";
import type { ValuePair } from "../../Utils/typeUtils.js";
export type RotatorDefs = {
    getStepCount: () => number;
    getSpinDurationMs?: () => number | undefined;
    getSettleDurationMs?: () => number | undefined;
    getRestDurationMs?: () => number | undefined;
    getIdleDelayMs?: () => number | undefined;
    getIsAutoSpinEnabled?: () => boolean;
    targetIndex?: ValuePair<number>;
    computeSpinTarget: () => number | Promise<number>;
    computeSpinDefs?: (index: number, stepCount: number) => RotatorSpinDefs;
    computeStepLabel: (index: number, stepCount: number) => string;
    onStepChange?: (index: number) => void;
    onSpinEnd?: (index: number) => void;
};
