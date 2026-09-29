import type { VNodeChild } from "vue";

import type { InteractionFlags, SelectFlags } from "@thewaver/ss-components";

import type { SelectOption, SelectPresetProps, SelectPresetSlots } from "../Select/Select.types";

export type MultiSelectProps<T> = SelectPresetProps<T> & {
    /** Which options are picked, which is what `v-model:values` binds. It is the only thing that picks them. */
    "values": T[];
    /** Receives the picked options whenever they change. */
    "onUpdate:values"?: (values: T[]) => void;
    /** Runs when the picked options change. */
    "onSelectionChange"?: (values: T[]) => void;
};

export type MultiSelectSlots<T> = SelectPresetSlots<T> & {
    /** Draws the field, and is handed everything that is picked. */
    renderContent: (props: { selectedOptions: SelectOption<T>[]; flags: InteractionFlags<SelectFlags> }) => VNodeChild;
};
