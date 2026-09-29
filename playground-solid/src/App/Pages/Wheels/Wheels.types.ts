import type { Accessor, Signal } from "solid-js";

import type { AccessorProps, RotatorSpinDefs } from "@thewaver/ss-components-solid";
import type { WheelSpinStyleKey } from "@thewaver/ss-playground/App/Pages/Wheels/WheelSpinStyle.types";

export type {
    WheelSpinStyleFn,
    WheelSpinStyleKey,
} from "@thewaver/ss-playground/App/Pages/Wheels/WheelSpinStyle.types";

export type WheelExampleProps = AccessorProps<{
    wedges: string[];
    isDisabled: boolean;
    spinDurationMs: number;
    settleDurationMs: number;
    restDurationMs: number;
    idleDelayMs: number | undefined;
    targetIndex: Signal<number>;
    computeSpinDefs: (index: number, wedgeCount: number) => RotatorSpinDefs;
    onSelectedWedgeChange: (index: number) => void;
}>;

export type WheelSharedProps = Omit<WheelExampleProps, "targetIndex" | "onSelectedWedgeChange">;

export type WheelsControls = {
    wedgeCount: Signal<number>;
    spinDuration: Signal<number>;
    turns: Signal<number>;
    settleDuration: Signal<number>;
    doesResume: Signal<boolean>;
    restDuration: Signal<number>;
    isIdlingAllowed: Signal<boolean>;
    idleDelay: Signal<number>;
    spinStyle: Signal<WheelSpinStyleKey>;
    isDisabled: Signal<boolean>;
    getWedges: Accessor<string[]>;
    getSharedProps: Accessor<WheelSharedProps>;
};
