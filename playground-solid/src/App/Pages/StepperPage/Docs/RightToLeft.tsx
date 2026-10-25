import { createSignal } from "solid-js";

import { Stepper, access } from "@thewaver/ss-components-solid";
import { STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperDocsExampleProps } from "../StepperPageSolid.types";

type Props = StepperDocsExampleProps;

export const RightToLeftDocsExample = (props: Props) => {
    const [getCurrent, setCurrent] = createSignal<StepValue>(STARTING_LINEAR);

    return (
        <div dir={"rtl"}>
            <Stepper
                steps={() => StepperPageUtils.buildSteps("rightToLeft", getCurrent(), access(props.isFreeNavigation))}
                currentValue={getCurrent}
                gap={STEPPER_GAP}
                ariaLabel={"Checkout"}
                computeStepAriaLabel={StepperPageUtils.describeStep}
                onCurrentChange={setCurrent}
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
        </div>
    );
};
