import type { ReactNode } from "react";

import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components";

import type { SelectOption, SelectPresetProps } from "../Select/Select.types";

export type MultiSelectProps<T> = SelectPresetProps<T> & {
    /** Which options are picked, and how to change them. It is the only thing that picks them. */
    valuesState: readonly [T[], (values: T[]) => void];
    /** Draws the field, and is handed everything that is picked. */
    renderContent: (selectedOptions: SelectOption<T>[], flags: InteractionFlags<SelectFlags>) => ReactNode;
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
