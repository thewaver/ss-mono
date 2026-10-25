import { useState } from "react";

import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFormButtons,
    PageFormFieldCaption,
    PageFormFieldMessage,
    PageFormSectionBody,
    PageFormSectionCaption,
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";

const FIELD_WIDTH = 240;
const CARD_DIGITS = 4;

const renderTextField = (state: readonly [string, (value: string) => void], hasError: boolean) => (
    <TextInput
        value={state}
        hasError={hasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
    />
);

export const NestedDocsExample = () => {
    const streetState = useState("");
    const cardState = useState("");
    const [outcome, setOutcome] = useState("Not ordered yet.");

    const streetMessage = streetState[0].trim().length > 0 ? "" : "We need somewhere to send it.";

    const cardMessage = /^\d{4}$/.test(cardState[0]) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`;

    return (
        <Form
            ariaLabel={"Delivery"}
            onSubmit={() => {
                if (streetMessage || cardMessage) return;

                setOutcome(`Ordered to ${streetState[0].trim()}.`);
            }}
            renderContent={(state) => (
                <PageFormStack>
                    <FormSection
                        ariaLabel={"Delivery"}
                        renderCaption={() => <PageFormSectionCaption>Delivery</PageFormSectionCaption>}
                        renderContent={() => (
                            <PageFormSectionBody>
                                <FormField
                                    hasError={streetMessage.length > 0}
                                    message={streetMessage}
                                    renderCaption={() => <PageFormFieldCaption>Street</PageFormFieldCaption>}
                                    renderMessage={(fieldState) => (
                                        <PageFormFieldMessage state={fieldState}>{streetMessage}</PageFormFieldMessage>
                                    )}
                                    renderControl={(fieldState) => renderTextField(streetState, fieldState.hasError)}
                                />

                                <FormSection
                                    ariaLabel={"Payment"}
                                    renderCaption={() => <PageFormSectionCaption>Payment</PageFormSectionCaption>}
                                    renderContent={() => (
                                        <PageFormSectionBody>
                                            <FormField
                                                hasError={cardMessage.length > 0}
                                                message={cardMessage}
                                                renderCaption={() => (
                                                    <PageFormFieldCaption>Card ending</PageFormFieldCaption>
                                                )}
                                                renderMessage={(fieldState) => (
                                                    <PageFormFieldMessage state={fieldState}>
                                                        {cardMessage}
                                                    </PageFormFieldMessage>
                                                )}
                                                renderControl={(fieldState) =>
                                                    renderTextField(cardState, fieldState.hasError)
                                                }
                                            />
                                        </PageFormSectionBody>
                                    )}
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Order</PageButtonContent>}
                        />
                    </PageFormButtons>

                    <div className={exampleStyles.exampleReadout} data-readout>
                        {`${state.isValid ? "Ready to send." : "Some fields need attention."} ${outcome}`}
                    </div>
                </PageFormStack>
            )}
        />
    );
};
