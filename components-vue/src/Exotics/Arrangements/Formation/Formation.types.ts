import type { VNodeChild } from "vue";

import type { BaseFormationProps, FormationItemState } from "@thewaver/ss-components";

export type FormationProps<T> = BaseFormationProps<T>;

export type FormationSlots<T> = {
    /** Draws one item, and is told where it was placed. */
    renderItem: (props: { item: T; state: FormationItemState }) => VNodeChild;
};
