import type { BinarySwitchPresetProps } from "../../../Primitives/BinarySwitch/BinarySwitch.types";

export type CheckboxProps<T = unknown> = Omit<BinarySwitchPresetProps, "checked"> & {
    /**
     * Whether the box is ticked, and how to change it. It is the only thing that ticks it. Leave it out and the box
     * holds its own state, starting unticked. Inside a `CheckboxGroup`, a box given a `value` reads the group's list
     * instead and this is not consulted.
     */
    checked?: readonly [boolean, (isChecked: boolean) => void];
    /**
     * The value this box stands for inside the nearest `CheckboxGroup`. Given one there, the box is ticked when the
     * group's list holds the value, and pressing it adds the value or takes it out. Outside a group it does nothing,
     * and the box answers to `checked` as usual.
     */
    value?: T;
};
