import { PlacementLayoutUtils, Stepper } from "@thewaver/ss-components-react";
import type { ArcDefs } from "@thewaver/ss-components-react";
import { LABELS, ORDER } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";

import {
    PageStepArcCell,
    PageStepArcConnector,
    PageStepContent,
} from "../../../StyledComponents/StepContent/StepContent";
import type { StepperExampleProps } from "../StepperPage.types";

const ARC_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 135,
    itemWidthRatio: 0.222,
    itemHeightRatio: 0.403,
};

const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

type Props = StepperExampleProps;

export const ArcExample = (props: Props) => {
    return (
        <Stepper
            steps={props.steps}
            currentValue={props.currentValue}
            ariaLabel={"Checkout, on an arc"}
            computeLayout={ARC_LAYOUT}
            computeStepAriaLabel={props.computeStepAriaLabel}
            onCurrentChange={props.onCurrentChange}
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
    );
};
