import { createSignal } from "solid-js";

import { Stepper, access } from "@thewaver/ss-components-solid";
import { STARTING_DETAILED } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.const";
import { StepperPageUtils } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperPage.utils";
import { BODIES, LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import { PageStepBody, PageStepConnector, PageStepContent } from "../../../StyledComponents/StepContent/StepContent";
import type { StepperDocsExampleProps } from "../StepperPageSolid.types";

type Props = StepperDocsExampleProps;

export const DetailedDocsExample = (props: Props) => {
    const [getCurrent, setCurrent] = createSignal<StepValue>(STARTING_DETAILED);

    return (
        <Stepper
            steps={() => StepperPageUtils.buildSteps("detailed", getCurrent(), access(props.isFreeNavigation))}
            currentValue={getCurrent}
            orientation={"vertical"}
            gap={STEPPER_GAP}
            ariaLabel={"Checkout with notes"}
            computeStepAriaLabel={StepperPageUtils.describeStep}
            onCurrentChange={setCurrent}
            renderStep={(getStep, getFlags) => (
                <PageStepContent
                    flags={getFlags}
                    state={() => getStep().state}
                    ordinal={() => ORDER.indexOf(getStep().value) + 1}
                    orientation={"vertical"}
                >
                    {LABELS[getStep().value]}
                </PageStepContent>
            )}
            renderBody={(getStep) => <PageStepBody>{BODIES[getStep().value]}</PageStepBody>}
            renderConnector={() => <PageStepConnector orientation={"vertical"} isRail={true} />}
        />
    );
};
