import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import type { StepValue } from "./StepperSteps.types";

export const EXAMPLE_NAMES = {
    stacked: "Stacked",
    detailed: "Steps that carry their own content",
    linear: "Linear",
    failed: "A step that failed",
    bare: "No connector",
    arc: "The same steps, bent along an arc",
};

export const STATE_WORDS: Record<PageStepState, string> = {
    done: "completed",
    current: "current step",
    failed: "needs attention",
    skipped: "skipped",
    ahead: "not started",
};

export const STARTING_LINEAR: StepValue = "address";

export const STARTING_FAILED: StepValue = "payment";

export const STARTING_STACKED: StepValue = "address";

export const STARTING_DETAILED: StepValue = "payment";

export const EXAMPLES_ROOT = "/src/App/Pages/StepperPage/Examples";
