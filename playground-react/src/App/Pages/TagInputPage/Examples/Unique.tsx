import { TagInput } from "@thewaver/ss-components-react";
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
import type { TagInputExampleProps } from "../TagInputPage.types";

type Props = TagInputExampleProps;

export const UniqueExample = (props: Props) => {
    return (
        <TagInput
            valueState={props.valueState}
            ariaLabel={"Unique topics"}
            gap={FIELD_GAP}
            padding={FIELD_PADDING}
            minHeight={FIELD_HEIGHT}
            isDisabled={props.isDisabled}
            hasError={props.hasError}
            computeTextStyle={computePageTextFieldTextStyle}
            computeTag={(text) => {
                const tag = text.trim().toLowerCase();

                return tag && !props.valueState[0].includes(tag) ? tag : undefined;
            }}
            renderContent={(flags) => <PageTagInputContent flags={flags} />}
            renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
            renderTag={(tag, flags) => <PageTagContent flags={flags}>{tag}</PageTagContent>}
        />
    );
};
