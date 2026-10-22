import type { ReactNode } from "react";

import type {
    BaseStepperProps,
    InteractionFlags,
    Step,
    StepperConnectorDefs,
    StepperFlags,
    StepperLayoutExcludesBody,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type StepperItemProps<TValue, TState> = Omit<InteractionControlProps<StepperFlags>, "id"> & {
    /** The step this item stands for. */
    step: Step<TValue, TState>;
    /** Runs when this step is chosen. */
    onSelect: (value: TValue) => void;
};

export type StepperProps<TValue, TState> = BaseStepperProps<TValue, TState> & {
    /**
     * Draws the line between one step and the next. It is told what the two steps are, so the line can show what has
     * been completed.
     */
    renderConnector?: (defs: StepperConnectorDefs) => ReactNode;
    /** A tooltip for one step, usually to explain why it cannot be reached yet. */
    computeTooltipDefs?: (
        step: Step<TValue, TState>,
        index: number,
    ) => InteractionTooltipDefs<StepperFlags> | undefined;
    /**
     * Draws one step. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a run.
     */
    renderStep: (step: Step<TValue, TState>, flags: InteractionFlags<StepperFlags>) => ReactNode;
    /**
     * Draws the body shown for the current step, in the panel beside its connector. Refused alongside `computeLayout`,
     * since a laid-out stepper has nowhere to put the panel.
     */
    renderBody?: (step: Step<TValue, TState>, index: number) => ReactNode;
} & StepperLayoutExcludesBody;
