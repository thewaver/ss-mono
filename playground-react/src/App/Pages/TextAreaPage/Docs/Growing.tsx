import { useState } from "react";

import { TextArea } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LONG_TEXT, MIN_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { TextAreaGrowingDocsExampleProps } from "../TextAreaPageReact.types";

type Props = TextAreaGrowingDocsExampleProps;

export const GrowingDocsExample = (props: Props) => {
    const valueState = useState(LONG_TEXT);

    return (
        <>
            <TextArea
                value={valueState}
                isAutoSizing={true}
                minRows={MIN_ROWS}
                maxRows={props.maxRows}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Message"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} isStretched={true} />}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Length: ${valueState[0].length}`}
            </div>
        </>
    );
};
