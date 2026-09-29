import type { Snippet } from "svelte";

import type {
    InteractionFlags,
    PlacementLayoutFn,
    ProximityEffectFn,
    Step,
    StepperConnectorDefs,
    StepperFlags,
    StepperOrientation,
} from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type StepperItemProps<TValue, TState> = Omit<InteractionControlProps<StepperFlags>, "id"> & {
    /** The step this item stands for. */
    step: Step<TValue, TState>;
    /** Runs when this step is chosen. */
    onSelect: (value: TValue) => void;
};

export type StepperProps<TValue, TState> = {
    /** Whether the steps run across the page or down it. */
    orientation?: StepperOrientation;
    /** The space between steps. */
    gap?: number;
    /** Names the stepper for assistive technology. */
    ariaLabel?: string;
    /**
     * Draws the line between one step and the next. It is told what the two steps are, so the line can show what has
     * been completed.
     */
    renderConnector?: Snippet<[defs: StepperConnectorDefs]>;
    /** The steps, in the order they are worked through. */
    steps: Step<TValue, TState>[];
    /** Which step is current. It is the only thing that moves the stepper on. */
    currentValue: TValue | undefined;
    /** Arranges the steps, for a stepper that is something other than a straight run. */
    computeLayout?: PlacementLayoutFn;
    /** What the steps do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Names one step for assistive technology, where its visible text is not enough on its own. */
    computeStepAriaLabel: (step: Step<TValue, TState>, index: number) => string;
    /** A tooltip for one step, usually to explain why it cannot be reached yet. */
    computeTooltipDefs?: (
        step: Step<TValue, TState>,
        index: number,
    ) => InteractionTooltipDefs<StepperFlags> | undefined;
    /**
     * Draws one step. It is handed the interaction state, and the placement for a layout that put it somewhere other
     * than in a run.
     */
    renderStep: Snippet<[step: Step<TValue, TState>, flags: InteractionFlags<StepperFlags>]>;
    /** Draws the body shown for the current step. */
    renderBody?: Snippet<[step: Step<TValue, TState>, index: number]>;
    /** Runs when a different step becomes current. */
    onCurrentChange?: (value: TValue) => void;
};
