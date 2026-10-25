import { useState } from "react";

import { TextArea } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
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
import type { TextAreaBasicDocsExampleProps } from "../TextAreaPageReact.types";

type Props = TextAreaBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState("");

    return (
        <>
            <TextArea
                value={valueState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                isReadOnly={props.isReadOnly}
                hasError={props.hasError}
                isDisabled={props.isDisabled}
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

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Length: ${valueState[0].length}`}
            </div>
        </>
    );
};
