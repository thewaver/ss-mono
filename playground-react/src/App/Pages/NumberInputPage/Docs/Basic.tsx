import { useState } from "react";

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
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { NumberInputBasicDocsExampleProps } from "../NumberInputPageReact.types";

type Props = NumberInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<number | undefined>(undefined);

    return (
        <NumberInput
            value={valueState}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            isReadOnly={props.isReadOnly}
            padding={FIELD_STEPPER_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"How many"}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
            renderPlaceholder={(flags) => <PageTextFieldPlaceholder flags={flags}>How many</PageTextFieldPlaceholder>}
            renderTrailing={(flags, stepper) => <PageNumberInputStepper flags={flags} stepper={stepper} />}
        />
    );
};
