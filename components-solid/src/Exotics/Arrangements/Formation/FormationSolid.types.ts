import type { Accessor, JSX } from "solid-js";

import type { BaseFormationCbs, BaseFormationValues, FormationItemState } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type FormationProps<T> = AccessorValues<BaseFormationValues<T>> &
    BaseFormationCbs & {
        /** Draws one item, and is told where it was placed. */
        renderItem: (getItem: Accessor<T>, getState: Accessor<FormationItemState>) => JSX.Element;
    };
