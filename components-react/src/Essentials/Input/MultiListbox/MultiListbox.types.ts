import type { ListboxPresetProps } from "../Listbox/Listbox.types";

export type MultiListboxProps<T> = ListboxPresetProps<T> & {
    /** Which options are picked, and how to change them. It is the only thing that picks them. */
    values: readonly [T[], (values: T[]) => void];
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
