import type { VNodeChild } from "vue";

import type { BaseStaircaseProps, StaircaseStepState } from "@thewaver/ss-components";

export type StaircaseProps<T> = BaseStaircaseProps<T>;

export type StaircaseSlots<T> = {
    /** Draws one step, and is told where it sits in the run. */
    renderStep: (props: { step: T; state: StaircaseStepState }) => VNodeChild;
};
