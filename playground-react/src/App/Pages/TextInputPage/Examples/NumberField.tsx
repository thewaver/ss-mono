import { TextInput } from "@thewaver/ss-components-react";
import {
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputExampleProps } from "../TextInputPage.types";

type Props = TextInputExampleProps;

export const NumberFieldExample = (props: Props) => (
    <TextInput
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        type={"number"}
        ariaLabel={"Quantity"}
        min={QUANTITY_MIN}
        max={QUANTITY_MAX}
        step={QUANTITY_STEP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
    />
);
