import { useState } from "react";

import { TextInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

export const RewritingDocsExample = () => {
    const valueState = useState("");

    return (
        <>
            <TextInput
                value={valueState}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Coupon code"}
                onInput={(value) => {
                    valueState[1](value.toLocaleUpperCase());
                }}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                renderPlaceholder={(flags) => (
                    <PageTextFieldPlaceholder flags={flags}>Coupon code (upper-cased)</PageTextFieldPlaceholder>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: "${valueState[0]}"`}
            </div>
        </>
    );
};
