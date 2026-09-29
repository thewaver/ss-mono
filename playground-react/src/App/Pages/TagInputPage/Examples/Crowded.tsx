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

const NARROW_WIDTH = 240;

type Props = TagInputExampleProps;

export const CrowdedExample = (props: Props) => {
    return (
        <div style={{ width: `${NARROW_WIDTH}px` }}>
            <TagInput
                value={props.value}
                ariaLabel={"Crowded topics"}
                gap={FIELD_GAP}
                padding={FIELD_PADDING}
                minHeight={FIELD_HEIGHT}
                isDisabled={props.isDisabled}
                hasError={props.hasError}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTagInputContent flags={flags} />}
                renderPlaceholder={() => <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>}
                renderTag={(tag, flags) => <PageTagContent flags={flags}>{tag}</PageTagContent>}
            />
        </div>
    );
};
