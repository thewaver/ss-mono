import { createSignal } from "solid-js";

import { FormField, TextInput } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal("");

    return (
        <div dir={"rtl"}>
            <FormField
                message={RIGHT_TO_LEFT_MESSAGE}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(getState) => (
                    <PageFormFieldMessage state={getState}>{RIGHT_TO_LEFT_MESSAGE}</PageFormFieldMessage>
                )}
                renderControl={(getState) => (
                    <TextInput
                        value={valueSignal}
                        hasError={() => getState().hasError}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                    />
                )}
            />
        </div>
    );
};
