import type { Accessor, JSX } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { InteractionFlags } from "../../Abstracts/InteractionTracker/InteractionTracker.types";
import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type {
    InteractionControlProps,
    InteractionTooltipDefs,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, MaybeAccessor } from "../../Utils/typeUtils";

export type StepperDir = "row" | "column";

export type StepperFlags = {
    isCurrent: boolean;
};

export type Step<TValue, TState> = {
    value: TValue;
    state: TState;
    isNavigable?: boolean;
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
    step: MaybeAccessor<Step<TValue, TState>>;
    onSelect: (value: TValue) => void;
};

export type StepperProps<TValue, TState> = AccessorProps<{
    dir?: StepperDir;
    gap?: number;
    ariaLabel?: string;
    renderConnector?: (getDefs: () => StepperConnectorDefs) => JSX.Element;
}> & {
    steps: MaybeAccessor<Step<TValue, TState>[]>;
    currentValue: MaybeAccessor<TValue | undefined>;
    computeLayout?: PlacementLayoutFn;
    computeStepAriaLabel: (step: Step<TValue, TState>, index: number) => string;
    computeTooltipDefs?: (
        step: Step<TValue, TState>,
        index: number,
    ) => InteractionTooltipDefs<StepperFlags> | undefined;
    renderStep: (
        getStep: Accessor<Step<TValue, TState>>,
        getFlags: () => InteractionFlags<StepperFlags>,
    ) => JSX.Element;
    renderBody?: (getStep: Accessor<Step<TValue, TState>>, index: number) => JSX.Element;
    onCurrentChange?: (value: TValue) => void;
};
