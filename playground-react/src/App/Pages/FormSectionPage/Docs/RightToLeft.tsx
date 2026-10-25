import { useState } from "react";

import { FormField, FormSection, TextInput } from "@thewaver/ss-components-react";
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
    const streetState = useState("");
    const cityState = useState("");

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
                                    value={streetState}
                                    padding={FIELD_PADDING}
                                    gap={FIELD_GAP}
                                    computeTextStyle={computePageTextFieldTextStyle}
                                    renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                                />
                            )}
                        />

                        <FormField
                            renderCaption={() => <PageFormFieldCaption>City</PageFormFieldCaption>}
                            renderControl={() => (
                                <TextInput
                                    value={cityState}
                                    padding={FIELD_PADDING}
                                    gap={FIELD_GAP}
                                    computeTextStyle={computePageTextFieldTextStyle}
                                    renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                                />
                            )}
                        />
                    </PageFormSectionBody>
                )}
            />
        </div>
    );
};
