import type { Accessor, JSX } from "solid-js";

import type {
    BaseStepperCbs,
    BaseStepperValues,
    InteractionFlags,
    Step,
    StepperConnectorDefs,
    StepperFlags,
    StepperLayoutExcludesBody,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, MaybeAccessor } from "../../Utils/typeUtils";

export type StepperItemProps<TValue, TState> = AccessorProps<Omit<InteractionControlProps<StepperFlags>, "id">> & {
    /** The step this item stands for. */
    step: MaybeAccessor<Step<TValue, TState>>;
    /** Runs when this step is chosen. */
    onSelect: (value: TValue) => void;
};

export type StepperProps<TValue, TState> = AccessorValues<BaseStepperValues<TValue, TState>> &
    BaseStepperCbs<TValue, TState> &
    AccessorProps<{
        /**
         * Draws the line between one step and the next. It is told what the two steps are, so the line can show what has
         * been completed.
         */
        renderConnector?: (getDefs: () => StepperConnectorDefs) => JSX.Element;
    }> & {
        /** A tooltip for one step, usually to explain why it cannot be reached yet. */
        computeTooltipDefs?: (
            step: Step<TValue, TState>,
            index: number,
        ) => InteractionTooltipDefs<StepperFlags> | undefined;
        /**
         * Draws one step. It is handed the interaction state, and the placement for a layout that put it somewhere other
         * than in a run.
         */
        renderStep: (
            getStep: Accessor<Step<TValue, TState>>,
            getFlags: () => InteractionFlags<StepperFlags>,
        ) => JSX.Element;
        /**
         * Draws the body shown for the current step, in the panel beside its connector. Refused alongside
         * `computeLayout`, since a laid-out stepper has nowhere to put the panel.
         */
        renderBody?: (getStep: Accessor<Step<TValue, TState>>, index: number) => JSX.Element;
    } & StepperLayoutExcludesBody;
