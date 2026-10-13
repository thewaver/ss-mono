import type { BaseCheckboxValues } from "@thewaver/ss-components";

import type { BinarySwitchPresetProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types.js";

export type CheckboxProps<T = unknown> = Omit<BinarySwitchPresetProps, "checked"> &
    BaseCheckboxValues<T> & {
        /**
         * Whether the box is ticked. Bind it with `bind:checked`; it is the only thing that ticks it. Leave it out and the
         * box holds its own state, starting unticked. Inside a `CheckboxGroup`, a box given a `value` reads the group's
         * list instead and this is not consulted.
         */
        checked?: boolean;
    };
