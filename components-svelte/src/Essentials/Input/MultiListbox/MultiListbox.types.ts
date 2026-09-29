import type { ListboxPresetProps } from "../Listbox/Listbox.types.js";

export type MultiListboxProps<T> = ListboxPresetProps<T> & {
    /** Which options are picked. Bind it with `bind:values`; it is the only thing that picks them. */
    values: T[];
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
