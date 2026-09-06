import type { BinarySwitchProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types";
import type { MaybeAccessor } from "../../../Utils/typeUtils";

export type RadioProps<T> = Omit<
    BinarySwitchProps,
    "type" | "isSwitch" | "name" | "isChecked" | "isMixed" | "isTabbable" | "ref"
> & {
    value: MaybeAccessor<T>;
};
