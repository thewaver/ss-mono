import { createSignal } from "solid-js";

import { FormField, TextInput, access } from "@thewaver/ss-components-solid";
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
import type { FormFieldBasicDocsExampleProps } from "../FormFieldPageSolid.types";

type Props = FormFieldBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueSignal = createSignal("");

    return (
        <FormField
            orientation={props.orientation}
            gap={props.gap}
            hasError={props.hasError}
            isRequired={props.isRequired}
            message={props.message}
            renderCaption={(getState) => (
                <PageFormFieldCaption>Display name{getState().isRequired ? " *" : ""}</PageFormFieldCaption>
            )}
            renderMessage={(getState) => (
                <PageFormFieldMessage state={getState}>{access(props.message)}</PageFormFieldMessage>
            )}
            renderControl={(getState) => (
                <TextInput
                    value={valueSignal}
                    hasError={() => getState().hasError}
                    isRequired={() => getState().isRequired}
                    padding={FIELD_PADDING}
                    gap={FIELD_GAP}
                    computeTextStyle={computePageTextFieldTextStyle}
                    renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                />
            )}
        />
    );
};
