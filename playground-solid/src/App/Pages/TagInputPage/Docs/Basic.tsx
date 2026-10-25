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
import type { TagInputBasicDocsExampleProps } from "../TagInputPageSolid.types";

type Props = TagInputBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal(STARTING_TAGS);

    return (
        <TagInput
            value={valueSignal}
            ariaLabel={"Topics"}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            hasError={props.hasError}
            isDisabled={props.isDisabled}
            computeTagAriaLabel={computeTagAriaLabel}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTagInputContent flags={getFlags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
            renderTag={(getTag, getFlags) => <PageTagContent flags={getFlags}>{getTag()}</PageTagContent>}
        />
    );
};
