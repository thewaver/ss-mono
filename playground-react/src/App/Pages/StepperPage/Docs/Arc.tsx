import { useState } from "react";

import { Stepper } from "@thewaver/ss-components-react";
import {
    ARC_LAYOUT,
    ARC_WIDTH,
    STARTING_LINEAR,
} from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import {
    PageStepArcCell,
    PageStepArcConnector,
    PageStepContent,
} from "../../../StyledComponents/StepContent/StepContent";
import type { StepperDocsExampleProps } from "../StepperPageReact.types";

type Props = StepperDocsExampleProps;

export const ArcDocsExample = (props: Props) => {
    const [current, setCurrent] = useState<StepValue>(STARTING_LINEAR);

    return (
        <div style={{ width: ARC_WIDTH }}>
            <Stepper
                steps={StepperPageUtils.buildSteps("arc", current, props.isFreeNavigation)}
                currentValue={current}
                ariaLabel={"Checkout, on an arc"}
                computeLayout={ARC_LAYOUT}
                computeStepAriaLabel={StepperPageUtils.describeStep}
                onCurrentChange={setCurrent}
                renderStep={(step, flags) => (
                    <PageStepArcCell>
                        <PageStepContent
                            flags={flags}
                            state={step.state}
                            ordinal={ORDER.indexOf(step.value) + 1}
                            orientation={"horizontal"}
                        >
                            {LABELS[step.value]}
                        </PageStepContent>
                    </PageStepArcCell>
                )}
                renderConnector={(defs) => <PageStepArcConnector defs={defs} />}
            />
        </div>
    );
};
