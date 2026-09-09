import type {
    AccessorProps,
    InteractionFlags,
    StepperConnectorDefs,
    StepperDir,
    StepperFlags,
} from "@thewaver/ss-components";

export type PageStepState = "done" | "current" | "failed" | "skipped" | "ahead";

export type StepContentProps = AccessorProps<{
    flags: InteractionFlags<StepperFlags>;
    state: PageStepState;
    ordinal: number;
    dir: StepperDir;
}>;

export type StepConnectorProps = AccessorProps<{
    dir: StepperDir;
    isRail?: boolean;
}>;

export type StepArcConnectorProps = AccessorProps<{
    defs: StepperConnectorDefs;
}>;
