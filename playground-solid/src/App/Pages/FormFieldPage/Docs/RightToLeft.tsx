import { createSignal } from "solid-js";

import { FormField, TextInput } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal("");

    return (
        <div dir={"rtl"}>
            <FormField
                message={MESSAGE}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(getState) => <PageFormFieldMessage state={getState}>{MESSAGE}</PageFormFieldMessage>}
                renderControl={(getState) => (
                    <TextInput
                        value={valueSignal}
                        hasError={() => getState().hasError}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                    />
                )}
            />
        </div>
    );
};
