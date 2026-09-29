import type { Snippet } from "svelte";

import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components";

import type { SelectOption, SelectPresetProps } from "../Select/Select.types.js";

export type MultiSelectProps<T> = SelectPresetProps<T> & {
    /** Which options are picked. Bind it with `bind:values`; it is the only thing that picks them. */
    values: T[];
    /** Draws the field, and is handed everything that is picked. */
    renderContent: Snippet<[selectedOptions: SelectOption<T>[], flags: InteractionFlags<SelectFlags>]>;
    /** Runs when the picked options change. */
    onSelectionChange?: (values: T[]) => void;
};
