import type {
    AccessorProps,
    InteractionFlags,
    StepperConnectorDefs,
    StepperFlags,
    StepperOrientation,
} from "@thewaver/ss-components";

export type PageStepState = "done" | "current" | "failed" | "skipped" | "ahead";

export type StepContentProps = AccessorProps<{
    flags: InteractionFlags<StepperFlags>;
    state: PageStepState;
    ordinal: number;
    orientation: StepperOrientation;
}>;

export type StepConnectorProps = AccessorProps<{
    orientation: StepperOrientation;
    isRail?: boolean;
}>;

export type StepArcConnectorProps = AccessorProps<{
    defs: StepperConnectorDefs;
}>;
