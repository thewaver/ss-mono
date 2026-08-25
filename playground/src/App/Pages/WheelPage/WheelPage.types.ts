import type { Signal } from "solid-js";

import type { AccessorProps, RotatorSpinDefs } from "@thewaver/ss-components";

export type WheelSpinStyleFn = (index: number, wedgeCount: number, turns: number) => RotatorSpinDefs;

export type WheelExampleProps = AccessorProps<{
    wedges: string[];
    isDisabled: boolean;
    spinDurationMs: number;
    settleDurationMs: number;
    restDurationMs: number;
    idleDelayMs: number | undefined;
    indexSignal: Signal<number>;
    computeSpinDefs: (index: number, wedgeCount: number) => RotatorSpinDefs;
    onSelectedWedgeChange: (index: number) => void;
}>;
