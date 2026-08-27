import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import type { StepValue } from "./StepperPage.types";

export const STEPPER_GAP = 5;

export const ORDER: StepValue[] = ["details", "address", "payment", "review"];

export const LABELS: Record<StepValue, string> = {
    details: "Details",
    address: "Address",
    payment: "Payment",
    review: "Review",
};

export const BODIES: Record<StepValue, string> = {
    details: "A name and an email address, both already on file. Nothing here needs typing twice.",
    address:
        "Where the box goes. The one on file is a flat you moved out of two years ago, which is the sort of thing this step exists to catch.",
    payment:
        "The card, and the small print nobody reads. Held until last so a mistyped digit costs one field rather than the whole form.",
    review: "Everything above, once more, in the order you filled it in. Press the button and it becomes somebody else's problem.",
};

export const STATE_WORDS: Record<PageStepState, string> = {
    done: "completed",
    current: "current step",
    failed: "needs attention",
    skipped: "skipped",
    ahead: "not started",
};
