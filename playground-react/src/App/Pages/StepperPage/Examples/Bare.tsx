import { Stepper } from "@thewaver/ss-components-react";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground-core/App/Pages/StepperPage/StepperSteps.const";

import { PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperExampleProps } from "../StepperPage.types";

type Props = StepperExampleProps;

export const BareExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout without connectors"}
            computeStepAriaLabel={props.computeStepAriaLabel}
            onCurrentChange={props.onCurrentChange}
            renderStep={(step, flags) => (
                <PageStepContent
                    flags={flags}
                    state={step.state}
                    ordinal={ORDER.indexOf(step.value) + 1}
                    orientation={"horizontal"}
                >
                    {LABELS[step.value]}
                </PageStepContent>
            )}
        />
    );
};
