import type { RotatorSpinDefs } from "@thewaver/ss-components-react";
import type { WheelSpinStyleKey } from "@thewaver/ss-playground-core/App/Pages/Wheels/WheelSpinStyle.types";

export type {
    WheelSpinStyleFn,
    WheelSpinStyleKey,
} from "@thewaver/ss-playground-core/App/Pages/Wheels/WheelSpinStyle.types";

export type WheelExampleProps = {
    wedges: string[];
    isDisabled: boolean;
    spinDurationMs: number;
    settleDurationMs: number;
    restDurationMs: number;
    idleDelayMs: number | undefined;
    targetIndexState: readonly [number, (value: number) => void];
    computeSpinDefs: (index: number, wedgeCount: number) => RotatorSpinDefs;
    onSelectedWedgeChange: (index: number) => void;
};

export type WheelSharedProps = Omit<WheelExampleProps, "targetIndexState" | "onSelectedWedgeChange">;

export type WheelsControls = {
    wedgeCountState: readonly [number, (value: number) => void];
    spinDurationState: readonly [number, (value: number) => void];
    turnsState: readonly [number, (value: number) => void];
    settleDurationState: readonly [number, (value: number) => void];
    doesResumeState: readonly [boolean, (value: boolean) => void];
    restDurationState: readonly [number, (value: number) => void];
    isIdlingAllowedState: readonly [boolean, (value: boolean) => void];
    idleDelayState: readonly [number, (value: number) => void];
    spinStyleState: readonly [WheelSpinStyleKey, (value: WheelSpinStyleKey) => void];
    isDisabledState: readonly [boolean, (value: boolean) => void];
    wedges: string[];
    sharedProps: WheelSharedProps;
};
