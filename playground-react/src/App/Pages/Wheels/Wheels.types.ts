import type { RotatorSpinDefs } from "@thewaver/ss-components-react";
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
    targetIndex: readonly [number, (value: number) => void];
    computeSpinDefs: (index: number, wedgeCount: number) => RotatorSpinDefs;
    onSelectedWedgeChange: (index: number) => void;
};

export type WheelSharedProps = Omit<WheelExampleProps, "targetIndex" | "onSelectedWedgeChange">;

export type WheelsControls = {
    wedgeCount: readonly [number, (value: number) => void];
    spinDuration: readonly [number, (value: number) => void];
    turns: readonly [number, (value: number) => void];
    settleDuration: readonly [number, (value: number) => void];
    doesResume: readonly [boolean, (value: boolean) => void];
    restDuration: readonly [number, (value: number) => void];
    isIdlingAllowed: readonly [boolean, (value: boolean) => void];
    idleDelay: readonly [number, (value: number) => void];
    spinStyle: readonly [WheelSpinStyleKey, (value: WheelSpinStyleKey) => void];
    isDisabled: readonly [boolean, (value: boolean) => void];
    wedges: string[];
    sharedProps: WheelSharedProps;
};
