import type { ListboxPresetProps, ListboxSlots } from "../Listbox/Listbox.types";

export type MultiListboxProps<T> = ListboxPresetProps<T> & {
    /** Which options are picked, which is what `v-model:values` binds. It is the only thing that picks them. */
    "values": T[];
    /** Receives the picked options whenever they change. */
    "onUpdate:values"?: (values: T[]) => void;
    /** Runs when the picked options change. */
    "onSelectionChange"?: (values: T[]) => void;
};

export type MultiListboxSlots<T> = ListboxSlots<T>;
