import type { BaseCheckboxValues } from "@thewaver/ss-components";

import type { BinarySwitchPresetProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types";

export type CheckboxProps<T = unknown> = Omit<BinarySwitchPresetProps, "checked"> &
    BaseCheckboxValues<T> & {
        /**
         * Whether the box is ticked, and how to change it. It is the only thing that ticks it. Leave it out and the box
         * holds its own state, starting unticked. Inside a `CheckboxGroup`, a box given a `value` reads the group's list
         * instead and this is not consulted.
         */
        checked?: readonly [boolean, (isChecked: boolean) => void];
    };
