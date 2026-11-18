import { useState } from "react";

import { FormField, TextInput } from "@thewaver/ss-components-react";
import { RIGHT_TO_LEFT_MESSAGE } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import { PageTextFieldContent } from "../../../StyledComponents/TextFieldContent/TextFieldContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState("");

    return (
        <div dir={"rtl"}>
            <FormField
                message={RIGHT_TO_LEFT_MESSAGE}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(state) => (
                    <PageFormFieldMessage state={state}>{RIGHT_TO_LEFT_MESSAGE}</PageFormFieldMessage>
                )}
                renderControl={(state) => (
                    <TextInput
                        value={valueState}
                        hasError={state.hasError}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                    />
                )}
            />
        </div>
    );
};
