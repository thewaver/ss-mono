import type {
    InteractionFlags,
    StepperConnectorDefs,
    StepperFlags,
    StepperOrientation,
} from "@thewaver/ss-components-react";

export type PageStepState = "done" | "current" | "failed" | "skipped" | "ahead";

export type StepContentProps = {
    flags: InteractionFlags<StepperFlags>;
    state: PageStepState;
    ordinal: number;
    orientation: StepperOrientation;
};

export type StepConnectorProps = {
    orientation: StepperOrientation;
    isRail?: boolean;
};

export type StepArcConnectorProps = {
    defs: StepperConnectorDefs;
};
