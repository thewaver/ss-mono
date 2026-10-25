import { createSignal } from "solid-js";

import { TagInput } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal(CROWDED_TAGS);

    return (
        <div style={{ width: `${NARROW_WIDTH}px` }}>
            <TagInput
                value={valueSignal}
                ariaLabel={"Crowded topics"}
                gap={FIELD_GAP}
                padding={FIELD_PADDING}
                minHeight={FIELD_HEIGHT}
                computeTagAriaLabel={computeTagAriaLabel}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTagInputContent flags={getFlags} />}
                renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
                renderTag={(getTag, getFlags) => <PageTagContent flags={getFlags}>{getTag()}</PageTagContent>}
            />
        </div>
    );
};
