import { NumberInput } from "@thewaver/ss-components";

import { PageNumberInputStepper } from "../../../StyledComponents/NumberInputStepper/NumberInputStepper";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { AMOUNT_STEP, FIELD_WIDTH, GERMAN_LOCALE } from "../NumberInputPage.const";
import type { NumberInputExampleProps } from "../NumberInputPage.types";

import { FIELD_GAP, FIELD_STEPPER_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

type Props = NumberInputExampleProps;

export const GermanExample = (props: Props) => (
    <NumberInput
        valueSignal={props.valueSignal}
        locale={() => GERMAN_LOCALE}
        step={() => AMOUNT_STEP}
        padding={() => FIELD_STEPPER_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Amount"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
        renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
    />
);
