import type { Step } from "@thewaver/ss-components";

import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import type { StepValue } from "./StepperSteps.types";

export type BaseStepperExampleValues = {
    steps: Step<StepValue, PageStepState>[];
    currentValue: StepValue;
};

export type BaseStepperExampleCbs = {
    computeStepAriaLabel: (step: Step<StepValue, PageStepState>, index: number) => string;
    onCurrentChange: (value: StepValue) => void;
};

export type BaseStepperExampleProps = BaseStepperExampleValues & BaseStepperExampleCbs;
