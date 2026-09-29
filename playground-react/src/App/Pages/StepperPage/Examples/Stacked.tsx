import { Stepper } from "@thewaver/ss-components-react";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperExampleProps } from "../StepperPage.types";

type Props = StepperExampleProps;

export const StackedExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            orientation={"vertical"}
            gap={STEPPER_GAP}
            ariaLabel={"Stacked checkout"}
            computeStepAriaLabel={props.computeStepAriaLabel}
            onCurrentChange={props.onCurrentChange}
            renderStep={(step, flags) => (
                <PageStepContent
                    flags={flags}
                    state={step.state}
                    ordinal={ORDER.indexOf(step.value) + 1}
                    orientation={"vertical"}
                >
                    {LABELS[step.value]}
                </PageStepContent>
            )}
            renderConnector={() => <PageStepConnector orientation={"vertical"} />}
        />
    );
};
