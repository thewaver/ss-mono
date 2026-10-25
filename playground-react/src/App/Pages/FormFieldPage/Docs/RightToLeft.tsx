import { useState } from "react";

import { FormField, TextInput } from "@thewaver/ss-components-react";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";

const MESSAGE = "Shown to everyone who can see your posts";

export const RightToLeftDocsExample = () => {
    const valueState = useState("");

    return (
        <div dir={"rtl"}>
            <FormField
                message={MESSAGE}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(state) => <PageFormFieldMessage state={state}>{MESSAGE}</PageFormFieldMessage>}
                renderControl={(state) => (
                    <TextInput
                        value={valueState}
                        hasError={state.hasError}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                    />
                )}
            />
        </div>
    );
};
