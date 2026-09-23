import type { SignalSource } from "../../../Utils/typeUtils";
import type { ListboxPresetProps } from "../Listbox/Listbox.types";

export type MultiListboxProps<T> = ListboxPresetProps<T> & {
    /** Which options are picked. It is the only thing that picks them. */
    valuesSignal: SignalSource<T[]>;
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
