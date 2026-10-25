import { createSignal } from "solid-js";

import { Stepper, access } from "@thewaver/ss-components-solid";
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
import type { StepperDocsExampleProps } from "../StepperPageSolid.types";

type Props = StepperDocsExampleProps;

export const ArcDocsExample = (props: Props) => {
    const [getCurrent, setCurrent] = createSignal<StepValue>(STARTING_LINEAR);

    return (
        <div style={{ width: ARC_WIDTH }}>
            <Stepper
                steps={() => StepperPageUtils.buildSteps("arc", getCurrent(), access(props.isFreeNavigation))}
                currentValue={getCurrent}
                ariaLabel={"Checkout, on an arc"}
                computeLayout={ARC_LAYOUT}
                computeStepAriaLabel={StepperPageUtils.describeStep}
                onCurrentChange={setCurrent}
                renderStep={(getStep, getFlags) => (
                    <PageStepArcCell>
                        <PageStepContent
                            flags={getFlags}
                            state={() => getStep().state}
                            ordinal={() => ORDER.indexOf(getStep().value) + 1}
                            orientation={"horizontal"}
                        >
                            {LABELS[getStep().value]}
                        </PageStepContent>
                    </PageStepArcCell>
                )}
                renderConnector={(getDefs) => <PageStepArcConnector defs={getDefs} />}
            />
        </div>
    );
};
