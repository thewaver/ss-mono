import type { BaseBinarySwitchValues, BinarySwitchCbs, BinarySwitchFlags } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../InteractionWrapper/InteractionWrapper.types.js";

export type BinarySwitchElementProps = BaseBinarySwitchValues &
    BinarySwitchCbs &
    InteractionControlProps<BinarySwitchFlags>;

export type BinarySwitchProps = Omit<InteractionWrapperProps<BinarySwitchFlags>, "renderControl" | "extraFlags"> &
    BaseBinarySwitchValues &
    BinarySwitchCbs &
    Pick<InteractionControlProps<BinarySwitchFlags>, "id" | "renderContent">;

export type BinarySwitchPresetProps = Omit<BinarySwitchProps, "type" | "isSwitch" | "isChecked"> & {
    /** Whether the switch is on. Bind it with `bind:checked`; it is the only thing that turns the switch. */
    checked: boolean;
};
