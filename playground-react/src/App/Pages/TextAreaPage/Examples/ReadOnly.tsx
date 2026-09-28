import { TextArea } from "@thewaver/ss-components-react";
import { FIELD_WIDTH, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

type Props = TextAreaExampleProps;

export const ReadOnlyExample = (props: Props) => (
    <TextArea
        valueState={props.valueState}
        isReadOnly={true}
        isAutoSizing={true}
        minRows={MIN_ROWS}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Read-only notes"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} isStretched={true} />}
    />
);
