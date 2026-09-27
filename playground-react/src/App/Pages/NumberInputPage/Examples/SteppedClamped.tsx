import { NumberInput } from "@thewaver/ss-components-react";
import {
    FIELD_WIDTH,
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground-core/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { NumberInputExampleProps } from "../NumberInputPage.types";

type Props = NumberInputExampleProps;

export const SteppedClampedExample = (props: Props) => (
    <NumberInput
        valueState={props.valueState}
        min={QUANTITY_MIN}
        max={QUANTITY_MAX}
        step={QUANTITY_STEP}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Quantity"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
        renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
    />
);
