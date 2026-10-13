import type { ReactNode } from "react";

import type { BaseFormationProps, FormationItemState } from "@thewaver/ss-components";

export type FormationProps<T> = BaseFormationProps<T> & {
    /** Draws one item, and is told where it was placed. */
    renderItem: (item: T, state: FormationItemState) => ReactNode;
};
