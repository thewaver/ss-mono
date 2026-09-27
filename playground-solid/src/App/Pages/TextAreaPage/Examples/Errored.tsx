import { TextArea } from "@thewaver/ss-components-solid";
import {
    FIELD_WIDTH,
    MAX_ROWS,
    MIN_ROWS,
    REVIEW_LIMIT,
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

export const ErroredExample = (props: Props) => (
    <TextArea
        valueSignal={props.valueSignal}
        isAutoSizing={true}
        minRows={() => MIN_ROWS}
        maxRows={() => MAX_ROWS}
        hasError={() => props.valueSignal[0]().length < REVIEW_LIMIT}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Review"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => (
            <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} isStretched={true} />
        )}
    />
);
