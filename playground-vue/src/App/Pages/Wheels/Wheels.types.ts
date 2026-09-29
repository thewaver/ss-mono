import type { Ref } from "vue";

import type { RotatorSpinDefs } from "@thewaver/ss-components-vue";
import type { WheelSpinStyleKey } from "@thewaver/ss-playground/App/Pages/Wheels/WheelSpinStyle.types";

export type {
    WheelSpinStyleFn,
    WheelSpinStyleKey,
} from "@thewaver/ss-playground/App/Pages/Wheels/WheelSpinStyle.types";

export type WheelExampleProps = {
    "wedges": string[];
    "isDisabled": boolean;
    "spinDurationMs": number;
    "settleDurationMs": number;
    "restDurationMs": number;
    "idleDelayMs": number | undefined;
    "targetIndex": number;
    "onUpdate:targetIndex"?: (value: number) => void;
    "computeSpinDefs": (index: number, wedgeCount: number) => RotatorSpinDefs;
    "onSelectedWedgeChange": (index: number) => void;
};

export type WheelSharedProps = Omit<
    WheelExampleProps,
    "targetIndex" | "onUpdate:targetIndex" | "onSelectedWedgeChange"
>;

export type WheelsControls = {
    wedgeCount: Ref<number>;
    spinDuration: Ref<number>;
    turns: Ref<number>;
    settleDuration: Ref<number>;
    doesResume: Ref<boolean>;
    restDuration: Ref<number>;
    isIdlingAllowed: Ref<boolean>;
    idleDelay: Ref<number>;
    spinStyle: Ref<WheelSpinStyleKey>;
    isDisabled: Ref<boolean>;
    wedges: Readonly<Ref<string[]>>;
    sharedProps: Readonly<Ref<WheelSharedProps>>;
};

export type WheelsPanelProps = {
    controls: WheelsControls;
};
