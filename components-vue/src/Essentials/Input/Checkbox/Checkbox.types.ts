import type { BaseCheckboxValues } from "@thewaver/ss-components";

import type { BinarySwitchPresetProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types";

export type CheckboxProps<T = unknown> = Omit<BinarySwitchPresetProps, "checked" | "onUpdate:checked"> &
    BaseCheckboxValues<T> & {
        /**
         * Whether the box is ticked. It is the only thing that ticks it. Leave it out and the box holds its own state,
         * starting unticked. Inside a `CheckboxGroup`, a box given a `value` reads the group's list instead and this is
         * not consulted.
         */
        "checked"?: boolean;
        /** Receives the box being ticked or cleared, which is what `v-model:checked` binds. */
        "onUpdate:checked"?: (isChecked: boolean) => void;
    };
