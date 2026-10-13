import type { BaseRadioValues } from "@thewaver/ss-components";

import type { BinarySwitchProps } from "../../../Primitives/BinarySwitch/BinarySwitchSolid.types";
import type { AccessorValues } from "../../../Utils/typeUtils";

export type RadioProps<T> = Omit<
    BinarySwitchProps,
    "type" | "isSwitch" | "name" | "isChecked" | "isMixed" | "isRequired" | "isTabbable" | "ref"
> &
    AccessorValues<BaseRadioValues<T>>;
