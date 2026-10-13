import type { Snippet } from "svelte";

import type { BaseStaircaseProps, StaircaseStepState } from "@thewaver/ss-components";

export type StaircaseProps<T> = BaseStaircaseProps<T> & {
    /** Draws one step, and is told where it sits in the run. */
    renderStep: Snippet<[step: T, state: StaircaseStepState]>;
};
