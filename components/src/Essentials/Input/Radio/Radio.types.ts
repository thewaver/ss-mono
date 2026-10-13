export type BaseRadioValues<T> = {
    /**
     * The value this radio stands for, which is what the group is set to when it is picked. It is compared with the
     * group's by identity.
     */
    value: T;
};

export type BaseRadioProps<T> = BaseRadioValues<T>;
