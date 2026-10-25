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
import type { FormFieldBasicDocsExampleProps } from "../FormFieldPageReact.types";

type Props = FormFieldBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState("");

    return (
        <FormField
            orientation={props.orientation}
            gap={props.gap}
            hasError={props.hasError}
            isRequired={props.isRequired}
            message={props.message}
            renderCaption={(state) => (
                <PageFormFieldCaption>Display name{state.isRequired ? " *" : ""}</PageFormFieldCaption>
            )}
            renderMessage={(state) => <PageFormFieldMessage state={state}>{props.message}</PageFormFieldMessage>}
            renderControl={(state) => (
                <TextInput
                    value={valueState}
                    hasError={state.hasError}
                    isRequired={state.isRequired}
                    padding={FIELD_PADDING}
                    gap={FIELD_GAP}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                />
            )}
        />
    );
};
