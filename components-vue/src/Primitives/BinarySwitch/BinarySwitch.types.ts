import type { BaseBinarySwitchValues, BinarySwitchCbs, BinarySwitchFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../InteractionWrapper/InteractionWrapper.types";

export type BinarySwitchElementProps = BaseBinarySwitchValues &
    BinarySwitchCbs &
    InteractionControlProps<BinarySwitchFlags>;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "extraFlags"> &
    BaseBinarySwitchValues &
    BinarySwitchCbs &
    Pick<InteractionControlProps<BinarySwitchFlags>, "id">;

export type BinarySwitchSlots = Pick<InteractionWrapperSlots<BinarySwitchFlags>, "renderDecoration"> &
    InteractionControlSlots<BinarySwitchFlags>;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> & {
    /** Whether the switch is on. It is the only thing that turns it. */
    "checked": boolean;
    /** Receives the switch being turned on or off, which is what `v-model:checked` binds. */
    "onUpdate:checked"?: (isChecked: boolean) => void;
};
