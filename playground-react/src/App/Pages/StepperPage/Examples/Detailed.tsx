import { Stepper } from "@thewaver/ss-components-react";
import { BODIES, LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

import { PageStepBody, PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperExampleProps } from "../StepperPage.types";

type Props = StepperExampleProps;

export const DetailedExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            orientation={"vertical"}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout with notes"}
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
            renderBody={(step) => <PageStepBody>{BODIES[step.value]}</PageStepBody>}
            renderConnector={() => <PageStepConnector orientation={"vertical"} isRail={true} />}
        />
    );
};
