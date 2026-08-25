import type { AccessorProps, Step } from "@thewaver/ss-components";

import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";

export type StepValue = "details" | "address" | "payment" | "review";

export type StepperExampleProps = AccessorProps<{
    steps: Step<StepValue, PageStepState>[];
    currentValue: StepValue;
}> & {
    computeStepAriaLabel: (step: Step<StepValue, PageStepState>, index: number) => string;
    onCurrentChange: (value: StepValue) => void;
};
