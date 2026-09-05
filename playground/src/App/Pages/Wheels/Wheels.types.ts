import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, RotatorSpinDefs } from "@thewaver/ss-components";

export type WheelSpinStyleFn = (index: number, wedgeCount: number, turns: number) => RotatorSpinDefs;

export type WheelSpinStyleKey = "rigid" | "bouncy";

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

export type WheelSharedProps = Omit<WheelExampleProps, "indexSignal" | "onSelectedWedgeChange">;

export type WheelsControls = {
    wedgeCountSignal: Signal<number>;
    spinDurationSignal: Signal<number>;
    turnsSignal: Signal<number>;
    settleDurationSignal: Signal<number>;
    doesResumeSignal: Signal<boolean>;
    restDurationSignal: Signal<number>;
    isIdlingAllowedSignal: Signal<boolean>;
    idleDelaySignal: Signal<number>;
    spinStyleSignal: Signal<WheelSpinStyleKey>;
    isDisabledSignal: Signal<boolean>;
    getWedges: Accessor<string[]>;
    getSharedProps: Accessor<WheelSharedProps>;
};
