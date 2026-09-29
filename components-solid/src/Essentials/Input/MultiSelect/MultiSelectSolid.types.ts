import type { Accessor, JSX } from "solid-js";

import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components";

import type { SignalSource } from "../../../Utils/typeUtils";
import type { SelectOption, SelectPresetProps } from "../Select/SelectSolid.types";

export type MultiSelectProps<T> = SelectPresetProps<T> & {
    /** Which options are picked. It is the only thing that picks them. */
    values: SignalSource<T[]>;
    /** Draws the field, and is handed everything that is picked. */
    renderContent: (
        getSelectedOptions: Accessor<SelectOption<T>[]>,
        getFlags: () => InteractionFlags<SelectFlags>,
    ) => JSX.Element;
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
