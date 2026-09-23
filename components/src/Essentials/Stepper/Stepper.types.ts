import type { Accessor, JSX } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";
import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperFlags = {
    isCurrent: boolean;
};

export type Step<TValue, TState> = {
    value: TValue;
    state: TState;
    isNavigable?: boolean;
    /**
     * Keeps this step in the tab order while it cannot be navigated to, so focus can land on it and a reader hears
     * its name and that it is unavailable. It still cannot be chosen. A step with a tooltip is kept reachable anyway,
     * so its explanation can be read.
     */
    isReachableWhenDisabled?: boolean;
    id?: string;
};

export type StepperConnectorDefs = {
    index: number;
    from?: PlacementRect;
    to?: PlacementRect;
    origin?: Point2d;
    radii?: Point2d;
};

export type StepperItemProps<TValue, TState> = AccessorProps<Omit<InteractionControlProps<StepperFlags>, "id">> & {
    /** The step this item stands for. */
    step: MaybeAccessor<Step<TValue, TState>>;
    /** Runs when this step is chosen. */
    onSelect: (value: TValue) => void;
};

export type StepperProps<TValue, TState> = AccessorProps<{
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
    renderConnector?: (getDefs: () => StepperConnectorDefs) => JSX.Element;
}> & {
    /** The steps, in the order they are worked through. */
    steps: MaybeAccessor<Step<TValue, TState>[]>;
    /** Which step is current. It is the only thing that moves the stepper on. */
    currentValue: MaybeAccessor<TValue | undefined>;
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
    renderStep: (
        getStep: Accessor<Step<TValue, TState>>,
        getFlags: () => InteractionFlags<StepperFlags>,
    ) => JSX.Element;
    /** Draws the body shown for the current step. */
    renderBody?: (getStep: Accessor<Step<TValue, TState>>, index: number) => JSX.Element;
    /** Runs when a different step becomes current. */
    onCurrentChange?: (value: TValue) => void;
};
