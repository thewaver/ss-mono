import { Label, TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextInputExampleProps } from "../TextInputPage.types";

const LABEL_GAP = 5;

type Props = TextInputExampleProps;

export const LabeledExample = (props: Props) => (
    <Label orientation={"vertical"} gap={LABEL_GAP}>
        <PageLabelCaption>Display name</PageLabelCaption>

        <TextInput
            valueState={props.valueState}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(flags) => <PageTextFieldContent flags={flags} />}
        />
    </Label>
);
