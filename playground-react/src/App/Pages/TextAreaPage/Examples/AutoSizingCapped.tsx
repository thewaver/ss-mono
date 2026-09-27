import { TextArea } from "@thewaver/ss-components-react";
import {
    FIELD_WIDTH,
    MAX_ROWS,
    MIN_ROWS,
} from "@thewaver/ss-playground-core/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

type Props = TextAreaExampleProps;

export const AutoSizingCappedExample = (props: Props) => (
    <TextArea
        valueState={props.valueState}
        isAutoSizing={true}
        minRows={MIN_ROWS}
        maxRows={MAX_ROWS}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Description"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} isStretched={true} />}
    />
);
