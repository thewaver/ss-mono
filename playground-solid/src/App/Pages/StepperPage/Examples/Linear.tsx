import { Stepper } from "@thewaver/ss-components-solid";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground-core/App/Pages/StepperPage/StepperSteps.const";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperExampleProps } from "../StepperPage.types";

type Props = StepperExampleProps;

export const LinearExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            gap={() => STEPPER_GAP}
            ariaLabel={"Checkout"}
            computeStepAriaLabel={props.computeStepAriaLabel}
            onCurrentChange={props.onCurrentChange}
            renderStep={(getStep, getFlags) => (
                <PageStepContent
                    flags={getFlags}
                    state={() => getStep().state}
                    ordinal={() => ORDER.indexOf(getStep().value) + 1}
                    orientation={"horizontal"}
                >
                    {LABELS[getStep().value]}
                </PageStepContent>
            )}
            renderConnector={() => <PageStepConnector orientation={"horizontal"} />}
        />
    );
};
