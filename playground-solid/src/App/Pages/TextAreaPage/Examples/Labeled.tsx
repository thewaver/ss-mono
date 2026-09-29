import { Label, TextArea } from "@thewaver/ss-components-solid";
import { FIELD_WIDTH, MAX_ROWS, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

const LABEL_GAP = 5;

type Props = TextAreaExampleProps;

export const LabeledExample = (props: Props) => (
    <Label orientation={"vertical"} gap={() => LABEL_GAP}>
        <PageLabelCaption>Bio</PageLabelCaption>

        <TextArea
            value={props.value}
            isAutoSizing={true}
            minRows={() => MIN_ROWS}
            maxRows={() => MAX_ROWS}
            padding={() => FIELD_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => (
                <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} isStretched={true} />
            )}
        />
    </Label>
);
