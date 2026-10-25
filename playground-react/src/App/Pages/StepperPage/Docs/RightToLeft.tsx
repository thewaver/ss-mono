import { useState } from "react";

import { Stepper } from "@thewaver/ss-components-react";
import { STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperDocsExampleProps } from "../StepperPageReact.types";

type Props = StepperDocsExampleProps;

export const RightToLeftDocsExample = (props: Props) => {
    const [current, setCurrent] = useState<StepValue>(STARTING_LINEAR);

    return (
        <div dir={"rtl"}>
            <Stepper
                steps={StepperPageUtils.buildSteps("rightToLeft", current, props.isFreeNavigation)}
                currentValue={current}
                gap={STEPPER_GAP}
                ariaLabel={"Checkout"}
                computeStepAriaLabel={StepperPageUtils.describeStep}
                onCurrentChange={setCurrent}
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
                renderConnector={() => <PageStepConnector orientation={"horizontal"} />}
            />
        </div>
    );
};
