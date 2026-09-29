import { TextArea } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
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

export const DisabledExample = (props: Props) => (
    <TextArea
        value={props.value}
        isDisabled={true}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        ariaLabel={"Disabled notes"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => (
            <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} height={() => FIXED_HEIGHT} />
        )}
    />
);
