import { PlacementLayoutUtils, Stepper } from "@thewaver/ss-components";
import type { ArcDefs } from "@thewaver/ss-components";

import {
    PageStepArcCell,
    PageStepArcConnector,
    PageStepContent,
} from "../../../StyledComponents/StepContent/StepContent";
import { LABELS, ORDER } from "../StepperPage.const";
import type { StepperExampleProps } from "../StepperPage.types";

const ARC_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 135,
    itemWidthRatio: 0.302,
    itemHeightRatio: 0.418,
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
            renderStep={(getStep, getFlags) => (
                <PageStepArcCell>
                    <PageStepContent
                        flags={getFlags}
                        state={() => getStep().state}
                        ordinal={() => ORDER.indexOf(getStep().value) + 1}
                        dir={"row"}
                    >
                        {LABELS[getStep().value]}
                    </PageStepContent>
                </PageStepArcCell>
            )}
            renderConnector={(getDefs) => <PageStepArcConnector defs={getDefs} />}
        />
    );
};
