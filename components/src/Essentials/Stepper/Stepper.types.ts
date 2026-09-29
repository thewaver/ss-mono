import type { Point2d } from "@thewaver/ss-utils";

import type { PlacementRect } from "../../Abstracts/Placement/Placement.types";

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
