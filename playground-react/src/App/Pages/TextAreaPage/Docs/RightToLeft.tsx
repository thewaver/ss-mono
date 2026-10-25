import { useState } from "react";

import { TextArea } from "@thewaver/ss-components-react";
import { FIELD_WIDTH, FIXED_HEIGHT } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

const STARTING_TEXT = "One line\nTwo lines\nThree lines, and the third one wraps onto a fourth";

export const RightToLeftDocsExample = () => {
    const valueState = useState(STARTING_TEXT);

    return (
        <div dir={"rtl"}>
            <TextArea
                value={valueState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Notes"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => (
                    <PageTextFieldContent flags={flags} width={FIELD_WIDTH} height={FIXED_HEIGHT} />
                )}
                renderPlaceholder={(flags) => (
                    <PageTextFieldPlaceholder flags={flags} isTopAligned={true}>
                        Notes
                    </PageTextFieldPlaceholder>
                )}
            />
        </div>
    );
};
