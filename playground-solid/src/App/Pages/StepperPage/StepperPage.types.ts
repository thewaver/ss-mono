import type { AccessorProps, Step } from "@thewaver/ss-components-solid";
import type { StepValue } from "@thewaver/ss-playground-core/App/Pages/StepperPage/StepperSteps.types";

import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";

export type StepperExampleProps = AccessorProps<{
    steps: Step<StepValue, PageStepState>[];
    currentValue: StepValue;
    computeStepAriaLabel: (step: Step<StepValue, PageStepState>, index: number) => string;
    onCurrentChange: (value: StepValue) => void;
}>;
