import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags } from "../../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { SignalSource } from "../../../Utils/typeUtils";
import type { SelectFlags, SelectOption, SelectPresetProps } from "../Select/Select.types";

export type MultiSelectProps<T> = SelectPresetProps<T> & {
    valuesSignal: SignalSource<T[]>;
    renderContent: (
        getSelectedOptions: Accessor<SelectOption<T>[]>,
        getFlags: () => InteractionFlags<SelectFlags>,
    ) => JSX.Element;
    onSelectionChange?: (values: T[]) => void;
};
