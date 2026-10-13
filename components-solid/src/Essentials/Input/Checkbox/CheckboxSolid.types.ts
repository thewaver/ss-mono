import type { BaseCheckboxValues } from "@thewaver/ss-components";

import type { BinarySwitchPresetProps } from "../../../Primitives/BinarySwitch/BinarySwitchSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type CheckboxProps<T = unknown> = Omit<BinarySwitchPresetProps, "checked"> &
    AccessorProps<{
        /**
         * Whether the box is ticked. It is the only thing that ticks it. Leave it out and the box holds its own
         * state, starting unticked. Inside a `CheckboxGroup`, a box given a `value` reads the group's list instead
         * and this is not consulted.
         */
        checked?: SignalSource<boolean>;
    }> &
    AccessorValues<BaseCheckboxValues<T>>;
