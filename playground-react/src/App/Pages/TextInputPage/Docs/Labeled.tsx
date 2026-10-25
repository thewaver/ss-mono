import { useState } from "react";

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

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueState = useState("");

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Display name</PageLabelCaption>

            <TextInput
                value={valueState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} />}
            />
        </Label>
    );
};
