import type { BaseRadioProps } from "@thewaver/ss-components";

import type { BinarySwitchProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types";

export type RadioProps<T> = Omit<
    BinarySwitchProps,
    "type" | "isSwitch" | "name" | "isChecked" | "isMixed" | "isRequired" | "isTabbable"
> &
    BaseRadioProps<T>;
