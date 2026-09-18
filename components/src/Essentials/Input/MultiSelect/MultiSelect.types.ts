import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { SignalSource } from "../../../Utils/typeUtils";
import type { SelectFlags, SelectOption, SelectPresetProps } from "../Select/Select.types";

export type MultiSelectProps<T> = SelectPresetProps<T> & {
    /** Which options are picked. It is the only thing that picks them. */
    valuesSignal: SignalSource<T[]>;
    /** Draws the field, and is handed everything that is picked. */
    renderContent: (
        getSelectedOptions: Accessor<SelectOption<T>[]>,
        getFlags: () => InteractionFlags<SelectFlags>,
    ) => JSX.Element;
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
