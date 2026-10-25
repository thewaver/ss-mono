import { useState } from "react";

import { Stepper } from "@thewaver/ss-components-react";
import { STARTING_DETAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { BODIES, LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageStepBody, PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperDocsExampleProps } from "../StepperPageReact.types";

type Props = StepperDocsExampleProps;

export const DetailedDocsExample = (props: Props) => {
    const [current, setCurrent] = useState<StepValue>(STARTING_DETAILED);

    return (
        <Stepper
            steps={StepperPageUtils.buildSteps("detailed", current, props.isFreeNavigation)}
            currentValue={current}
            orientation={"vertical"}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout with notes"}
            computeStepAriaLabel={StepperPageUtils.describeStep}
            onCurrentChange={setCurrent}
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
