import { createSignal } from "solid-js";

import { FormField, FormSection, TextInput } from "@thewaver/ss-components-solid";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import {
    PageFormFieldCaption,
    PageFormSectionBody,
    PageFormSectionCaption,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";

export const RightToLeftDocsExample = () => {
    const streetSignal = createSignal("");
    const citySignal = createSignal("");

    return (
        <div dir={"rtl"}>
            <FormSection
                renderCaption={() => <PageFormSectionCaption>Delivery</PageFormSectionCaption>}
                renderContent={() => (
                    <PageFormSectionBody>
                        <FormField
                            renderCaption={() => <PageFormFieldCaption>Street</PageFormFieldCaption>}
                            renderControl={() => (
                                <TextInput
                                    value={streetSignal}
                                    padding={FIELD_PADDING}
                                    gap={FIELD_GAP}
                                    computeTextStyle={computePageTextFieldTextStyle}
                                    renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                                />
                            )}
                        />

                        <FormField
                            renderCaption={() => <PageFormFieldCaption>City</PageFormFieldCaption>}
                            renderControl={() => (
                                <TextInput
                                    value={citySignal}
                                    padding={FIELD_PADDING}
                                    gap={FIELD_GAP}
                                    computeTextStyle={computePageTextFieldTextStyle}
                                    renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                                />
                            )}
                        />
                    </PageFormSectionBody>
                )}
            />
        </div>
    );
};
