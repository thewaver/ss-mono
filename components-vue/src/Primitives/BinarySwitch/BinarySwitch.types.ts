import type { BinarySwitchCbs, BinarySwitchFlags, BinarySwitchState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../InteractionWrapper/InteractionWrapper.types";

export type { BinarySwitchCbs, BinarySwitchState };

export type BinarySwitchElementProps = BinarySwitchCbs & InteractionControlProps<BinarySwitchFlags> & BinarySwitchState;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "extraFlags"> &
    BinarySwitchCbs &
    Pick<InteractionControlProps<BinarySwitchFlags>, "id"> &
    BinarySwitchState;

export type BinarySwitchSlots = Pick<InteractionWrapperSlots<BinarySwitchFlags>, "renderDecoration"> &
    InteractionControlSlots<BinarySwitchFlags>;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> & {
    /** Whether the switch is on. It is the only thing that turns it. */
    "checked": boolean;
    /** Receives the switch being turned on or off, which is what `v-model:checked` binds. */
    "onUpdate:checked"?: (isChecked: boolean) => void;
};
