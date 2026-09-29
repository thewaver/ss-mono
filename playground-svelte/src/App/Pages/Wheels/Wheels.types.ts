import type { RotatorSpinDefs } from "@thewaver/ss-components-svelte";
import type { WheelSpinStyleKey } from "@thewaver/ss-playground/App/Pages/Wheels/WheelSpinStyle.types";

export type {
    WheelSpinStyleFn,
    WheelSpinStyleKey,
} from "@thewaver/ss-playground/App/Pages/Wheels/WheelSpinStyle.types";

export type WheelExampleProps = {
    wedges: string[];
    isDisabled: boolean;
    spinDurationMs: number;
    settleDurationMs: number;
    restDurationMs: number;
    idleDelayMs: number | undefined;
    targetIndex: number;
    computeSpinDefs: (index: number, wedgeCount: number) => RotatorSpinDefs;
    onSelectedWedgeChange: (index: number) => void;
};

export type WheelSharedProps = Omit<WheelExampleProps, "targetIndex" | "onSelectedWedgeChange">;

export type WheelsControls = {
    wedgeCount: number;
    spinDuration: number;
    turns: number;
    settleDuration: number;
    doesResume: boolean;
    restDuration: number;
    isIdlingAllowed: boolean;
    idleDelay: number;
    spinStyle: WheelSpinStyleKey;
    isDisabled: boolean;
    readonly wedges: string[];
    readonly sharedProps: WheelSharedProps;
};
