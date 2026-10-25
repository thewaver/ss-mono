import { createSignal } from "solid-js";

import { Stepper, access } from "@thewaver/ss-components-solid";
import { STARTING_LINEAR } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperBasicDocsExampleProps } from "../StepperPageSolid.types";

type Props = StepperBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getCurrent, setCurrent] = createSignal<StepValue>(STARTING_LINEAR);

    return (
        <Stepper
            steps={() => StepperPageUtils.buildSteps("basic", getCurrent(), access(props.isFreeNavigation))}
            currentValue={getCurrent}
            orientation={props.orientation}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout"}
            computeStepAriaLabel={StepperPageUtils.describeStep}
            onCurrentChange={setCurrent}
            renderStep={(getStep, getFlags) => (
                <PageStepContent
                    flags={getFlags}
                    state={() => getStep().state}
                    ordinal={() => ORDER.indexOf(getStep().value) + 1}
                    orientation={props.orientation}
                >
                    {LABELS[getStep().value]}
                </PageStepContent>
            )}
            renderConnector={() => <PageStepConnector orientation={props.orientation} />}
        />
    );
};
