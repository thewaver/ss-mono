import type { Point2d } from "@thewaver/ss-utils";

import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperFlags = {
    isCurrent: boolean;
};

export type Step<TValue, TState> = {
    /** The step's value, which the current step is told by. */
    value: TValue;
    /** Where the step stands — done, current, failed or whatever the consumer's states are — handed to the painter. */
    state: TState;
    /** Whether a person may go to this step. Left out, they may. */
    isNavigable?: boolean;
    /**
     * Keeps this step in the tab order while it cannot be navigated to, so focus can land on it and a reader hears
     * its name and that it is unavailable. It still cannot be chosen. A step with a tooltip is kept reachable anyway,
     * so its explanation can be read.
     */
    isReachableWhenDisabled?: boolean;
    /** The id put on the step's control, so a label or a test can reach it. One is generated when left out. */
    id?: string;
};

export type StepperConnectorDefs = {
    /** The step the connector leaves, counting from zero. */
    index: number;
    /** Where the step it leaves was placed, when the steps follow a layout. */
    from?: PlacementRect;
    /** Where the step it reaches was placed, when the steps follow a layout. */
    to?: PlacementRect;
    /** The layout's center, so a connector can follow the curve the steps sit on. */
    origin?: Point2d;
    /** The layout's radii, for the same. */
    radii?: Point2d;
};

export type BaseStepperValues<TValue, TState> = {
    /** Whether the steps run across the page or down it. */
    orientation?: StepperOrientation;
    /** The space between steps. */
    gap?: number;
    /** Names the stepper for assistive technology. */
    ariaLabel?: string;
    /** The steps, in the order they are worked through. */
    steps: Step<TValue, TState>[];
    /** Which step is current. It is the only thing that moves the stepper on. */
    currentValue: TValue | undefined;
};

export type BaseStepperCbs<TValue, TState> = {
    /**
     * Arranges the steps, for a stepper that is something other than a straight run. A laid-out stepper has nowhere to
     * put a step's panel, so it is refused alongside `renderBody`.
     */
    computeLayout?: PlacementLayoutFn;
    /** What the steps do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /** Names one step for assistive technology, where its visible text is not enough on its own. */
    computeStepAriaLabel: (step: Step<TValue, TState>, index: number) => string;
    /** Runs when a different step becomes current. */
    onCurrentChange?: (value: TValue) => void;
};

export type BaseStepperProps<TValue, TState> = BaseStepperValues<TValue, TState> & BaseStepperCbs<TValue, TState>;

export type StepperLayoutExcludesBody = { computeLayout?: undefined } | { renderBody?: undefined };
