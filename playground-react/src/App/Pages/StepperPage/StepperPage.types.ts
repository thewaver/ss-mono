import type { Step } from "@thewaver/ss-components-react";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";

export type StepperExampleProps = {
    steps: Step<StepValue, PageStepState>[];
    currentValue: StepValue;
    computeStepAriaLabel: (step: Step<StepValue, PageStepState>, index: number) => string;
    onCurrentChange: (value: StepValue) => void;
};
