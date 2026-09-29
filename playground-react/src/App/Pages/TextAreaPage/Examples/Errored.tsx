import { TextArea } from "@thewaver/ss-components-react";
import {
    FIELD_WIDTH,
    MAX_ROWS,
    MIN_ROWS,
    REVIEW_LIMIT,
} from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
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

export const ErroredExample = (props: Props) => (
    <TextArea
        value={props.value}
        isAutoSizing={true}
        minRows={MIN_ROWS}
        maxRows={MAX_ROWS}
        hasError={props.value[0].length < REVIEW_LIMIT}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Review"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} isStretched={true} />}
    />
);
