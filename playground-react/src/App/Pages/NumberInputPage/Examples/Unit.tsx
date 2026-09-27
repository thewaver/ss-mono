import { NumberInput } from "@thewaver/ss-components-react";
import { FIELD_WIDTH } from "@thewaver/ss-playground-core/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import { PageTextFieldAdornment } from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { NumberInputExampleProps } from "../NumberInputPage.types";

type Props = NumberInputExampleProps;

export const UnitExample = (props: Props) => (
    <NumberInput
        valueState={props.valueState}
        min={0}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Width"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
        renderTrailing={(flags, stepper) => (
            <>
                <PageTextFieldAdornment flags={flags}>px</PageTextFieldAdornment>

                <PageNumberInputStepper flags={flags} stepper={stepper} />
            </>
        )}
    />
);
