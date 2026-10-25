import { useState } from "react";

import { TagInput } from "@thewaver/ss-components-react";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { CROWDED_TAGS, NARROW_WIDTH } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
import {
    FIELD_GAP,
    FIELD_HEIGHT,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTagContent,
    PageTagInputContent,
    PageTagInputPlaceholder,
} from "../../../StyledComponents/TagInputContent/TagInputContent";
import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent";

export const CrowdedDocsExample = () => {
    const valueState = useState(CROWDED_TAGS);

    return (
        <div style={{ width: `${NARROW_WIDTH}px` }}>
            <TagInput
                value={valueState}
                ariaLabel={"Crowded topics"}
                gap={FIELD_GAP}
                padding={FIELD_PADDING}
                minHeight={FIELD_HEIGHT}
                computeTagAriaLabel={computeTagAriaLabel}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTagInputContent flags={flags} />}
                renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
                renderTag={(tag, flags) => <PageTagContent flags={flags}>{tag}</PageTagContent>}
            />
        </div>
    );
};
