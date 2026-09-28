import { Label, NumberInput } from "@thewaver/ss-components-react";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { NumberInputExampleProps } from "../NumberInputPage.types";

const LABEL_GAP = 5;
const GUEST_MIN = 1;
const GUEST_MAX = 8;

type Props = NumberInputExampleProps;

export const LabeledExample = (props: Props) => (
    <Label orientation={"vertical"} gap={LABEL_GAP}>
        <PageLabelCaption>Guests</PageLabelCaption>

        <NumberInput
            valueState={props.valueState}
            min={GUEST_MIN}
            max={GUEST_MAX}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
        />
    </Label>
);
