import type { BinarySwitchProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types.js";
export type RadioProps<T> = Omit<BinarySwitchProps, "type" | "isSwitch" | "name" | "isChecked" | "isMixed" | "isRequired" | "isTabbable" | "ref"> & {
    /**
     * The value this radio stands for, which is what the group is set to when it is picked. It is compared with the
     * group's by identity.
     */
    value: T;
};
