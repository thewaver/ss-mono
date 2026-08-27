import { Stepper } from "@thewaver/ss-components";

import { PageStepBody, PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import { BODIES, LABELS, ORDER, STEPPER_GAP } from "../StepperPage.const";
import type { StepperExampleProps } from "../StepperPage.types";

type Props = StepperExampleProps;

export const DetailedExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            dir={"column"}
            gap={() => STEPPER_GAP}
            ariaLabel={"Checkout with notes"}
            computeStepAriaLabel={props.computeStepAriaLabel}
            onCurrentChange={props.onCurrentChange}
            renderStep={(getStep, getFlags) => (
                <PageStepContent
                    flags={getFlags}
                    state={() => getStep().state}
                    ordinal={() => ORDER.indexOf(getStep().value) + 1}
                    dir={"column"}
                >
                    {LABELS[getStep().value]}
                </PageStepContent>
            )}
            renderBody={(getStep) => <PageStepBody>{BODIES[getStep().value]}</PageStepBody>}
            renderConnector={() => <PageStepConnector dir={"column"} isRail={true} />}
        />
    );
};
