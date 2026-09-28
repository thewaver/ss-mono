import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components-react";
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
import type { FormSectionNestedExampleProps, FormSectionTextState } from "../FormSectionPage.types";

const FIELD_WIDTH = 240;
const CARD_DIGITS = 4;

type Props = FormSectionNestedExampleProps;

const renderTextField = (state: FormSectionTextState, hasError: boolean) => (
    <TextInput
        valueState={state}
        hasError={hasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
    />
);

export const NestedExample = (props: Props) => {
    const streetMessage = props.streetState[0].trim().length > 0 ? "" : "We need somewhere to send it.";

    const cardMessage = /^\d{4}$/.test(props.cardState[0]) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`;

    return (
        <Form
            ariaLabel={"Delivery"}
            onSubmit={props.onSubmit}
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
                                    renderControl={(fieldState) =>
                                        renderTextField(props.streetState, fieldState.hasError)
                                    }
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
                                                    renderTextField(props.cardState, fieldState.hasError)
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
                            isDisabled={!state.isValid}
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Order</PageButtonContent>}
                        />
                    </PageFormButtons>
                </PageFormStack>
            )}
        />
    );
};
