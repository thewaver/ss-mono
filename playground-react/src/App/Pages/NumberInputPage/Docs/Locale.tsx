import { useState } from "react";

import { NumberInput } from "@thewaver/ss-components-react";
import { AMOUNT_STEP, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageNumberInputStepper } from "../../../PageComponents/NumberInputStepper/NumberInputStepper";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { NumberInputLocaleDocsExampleProps } from "../NumberInputPageReact.types";

type Props = NumberInputLocaleDocsExampleProps;

export const LocaleDocsExample = (props: Props) => {
    const valueState = useState<number | undefined>(1234.5);

    return (
        <NumberInput
            value={valueState}
            locale={props.locale}
            step={AMOUNT_STEP}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Amount"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
        />
    );
};
