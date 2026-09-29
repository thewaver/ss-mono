import { NumberInput } from "@thewaver/ss-components-solid";
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
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { NumberInputExampleProps } from "../NumberInputPage.types";

type Props = NumberInputExampleProps;

export const DefaultExample = (props: Props) => (
    <NumberInput
        value={props.value}
        padding={() => FIELD_STEPPER_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"How many"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
        renderPlaceholder={(getFlags) => <PageTextFieldPlaceholder flags={getFlags}>How many</PageTextFieldPlaceholder>}
        renderTrailing={(getFlags, stepper) => <PageNumberInputStepper flags={getFlags} stepper={stepper} />}
    />
);
