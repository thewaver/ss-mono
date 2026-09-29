import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";

export const STATE_WORDS: Record<PageStepState, string> = {
    done: "completed",
    current: "current step",
    failed: "needs attention",
    skipped: "skipped",
    ahead: "not started",
};
