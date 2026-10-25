import { useState } from "react";

import { Label, TagInput } from "@thewaver/ss-components-react";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { STARTING_TAGS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import {
    PageTagContent,
    PageTagInputContent,
    PageTagInputPlaceholder,
} from "../../../StyledComponents/TagInputContent/TagInputContent";
import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueState = useState(STARTING_TAGS);

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Topics</PageLabelCaption>

            <TagInput
                value={valueState}
                gap={FIELD_GAP}
                padding={FIELD_PADDING}
                minHeight={FIELD_HEIGHT}
                computeTagAriaLabel={computeTagAriaLabel}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTagInputContent flags={flags} />}
                renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
                renderTag={(tag, flags) => <PageTagContent flags={flags}>{tag}</PageTagContent>}
            />
        </Label>
    );
};
