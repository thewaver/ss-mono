export type BaseCheckboxValues<T = unknown> = {
    /**
     * The value this box stands for inside the nearest `CheckboxGroup`. Given one there, the box is ticked when the
     * group's list holds the value, and pressing it adds the value or takes it out. Outside a group it does nothing,
     * and the box answers to `checked` as usual.
     */
    value?: T;
};

export type BaseCheckboxProps<T = unknown> = BaseCheckboxValues<T>;
