import type { BinarySwitchProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types";
import type { MaybeAccessor } from "../../../Utils/typeUtils";

export type RadioProps<T> = Omit<
    BinarySwitchProps,
    "type" | "isSwitch" | "name" | "isChecked" | "isMixed" | "isTabbable" | "ref"
> & {
    /** The value this radio stands for, which is what the group is set to when it is picked. */
    value: MaybeAccessor<T>;
};
