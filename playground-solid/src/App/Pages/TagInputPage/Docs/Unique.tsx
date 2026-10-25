import { createSignal } from "solid-js";

import { TagInput } from "@thewaver/ss-components-solid";
import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { STARTING_TAGS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
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

export const UniqueDocsExample = () => {
    const valueSignal = createSignal(STARTING_TAGS);

    return (
        <TagInput
            value={valueSignal}
            ariaLabel={"Unique topics"}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            computeTag={(text) => {
                const tag = text.trim().toLowerCase();

                return tag && !valueSignal[0]().includes(tag) ? tag : undefined;
            }}
            computeTagAriaLabel={computeTagAriaLabel}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTagInputContent flags={getFlags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
            renderTag={(getTag, getFlags) => <PageTagContent flags={getFlags}>{getTag()}</PageTagContent>}
        />
    );
};
