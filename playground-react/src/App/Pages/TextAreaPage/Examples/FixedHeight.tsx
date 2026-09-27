import { TextArea } from "@thewaver/ss-components-react";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground-core/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground-core/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { TextAreaExampleProps } from "../TextAreaPage.types";

type Props = TextAreaExampleProps;

export const FixedHeightExample = (props: Props) => (
    <TextArea
        valueState={props.valueState}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        ariaLabel={"Notes"}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />}
        renderPlaceholder={(flags) => (
            <PageTextFieldPlaceholder flags={flags} isTopAligned={true}>
                Notes
            </PageTextFieldPlaceholder>
        )}
    />
);
