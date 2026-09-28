import { NumberInput } from "@thewaver/ss-components-react";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { NumberInputExampleProps } from "../NumberInputPage.types";

type Props = NumberInputExampleProps;

export const ReachableExample = (props: Props) => (
    <NumberInput
        valueState={props.valueState}
        isDisabled={true}
        isReachableWhenDisabled={true}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Disabled but reachable amount"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
        renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
        tooltipDefs={{
            placement: { x: "center", y: "top-out" },
            offset: { x: 0, y: 10 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Focusable so this tooltip can be read, but neither the arrows nor the stepper may move the value.
                </PageTooltipContent>
            ),
        }}
    />
);
