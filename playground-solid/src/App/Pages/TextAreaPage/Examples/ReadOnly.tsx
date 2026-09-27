import { TextArea } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH, MIN_ROWS } from "@thewaver/ss-playground-core/App/Pages/TextAreaPage/TextAreaPage.const";
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

export const ReadOnlyExample = (props: Props) => (
    <TextArea
        valueSignal={props.valueSignal}
        isReadOnly={true}
        isAutoSizing={true}
        minRows={() => MIN_ROWS}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Read-only notes"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => (
            <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} isStretched={true} />
        )}
    />
);
