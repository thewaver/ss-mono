import { useState } from "react";

import { TextInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { PIN_LENGTH } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const RefusingDocsExample = () => {
    const valueState = useState("");

    return (
        <>
            <TextInput
                value={valueState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"PIN"}
                inputMode={"numeric"}
                hasError={valueState[0].length > 0 && valueState[0].length < PIN_LENGTH}
                onInput={(value) => {
                    valueState[1](value.replace(/\D/g, "").slice(0, PIN_LENGTH));
                }}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                renderPlaceholder={(flags) => (
                    <PageTextFieldPlaceholder flags={flags}>Digits only</PageTextFieldPlaceholder>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: "${valueState[0]}"`}
            </div>
        </>
    );
};
