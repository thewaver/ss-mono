import type { Accessor, JSX } from "solid-js";

import type { BaseStaircaseCbs, BaseStaircaseValues, StaircaseStepState } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type StaircaseProps<T> = AccessorValues<BaseStaircaseValues<T>> &
    BaseStaircaseCbs & {
        /** Draws one step, and is told where it sits in the run. */
        renderStep: (getStep: Accessor<T>, getState: Accessor<StaircaseStepState>) => JSX.Element;
    };
