import type { InteractionFlags, StepperConnectorDefs, StepperFlags, StepperOrientation } from "@thewaver/ss-components";

export type PageStepState = "done" | "current" | "failed" | "skipped" | "ahead";

export type BaseStepContentValues = {
    flags: InteractionFlags<StepperFlags>;
    state: PageStepState;
    ordinal: number;
    orientation: StepperOrientation;
};

export type BaseStepContentProps = BaseStepContentValues;

export type BaseStepConnectorValues = {
    orientation: StepperOrientation;
    isRail?: boolean;
};

export type BaseStepConnectorProps = BaseStepConnectorValues;

export type BaseStepArcConnectorValues = {
    defs: StepperConnectorDefs;
};

export type BaseStepArcConnectorProps = BaseStepArcConnectorValues;
