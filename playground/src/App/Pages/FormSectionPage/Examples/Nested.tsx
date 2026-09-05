import type { Signal } from "solid-js";

import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components";

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
import type { FormSectionNestedExampleProps } from "../FormSectionPage.types";

import { FIELD_GAP, FIELD_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

const FIELD_WIDTH = 240;
const CARD_DIGITS = 4;

type Props = FormSectionNestedExampleProps;

const renderTextField = (signal: Signal<string>, getHasError: () => boolean) => (
    <TextInput
        valueSignal={signal}
        hasError={getHasError}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
    />
);

export const NestedExample = (props: Props) => {
    const getStreetMessage = () => (props.streetSignal[0]().trim().length > 0 ? "" : "We need somewhere to send it.");

    const getCardMessage = () =>
        /^\d{4}$/.test(props.cardSignal[0]()) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`;

    return (
        <Form
            ariaLabel={"Delivery"}
            onSubmit={props.onSubmit}
            renderContent={(getState) => (
                <PageFormStack>
                    <FormSection
                        ariaLabel={"Delivery"}
                        renderCaption={() => <PageFormSectionCaption>Delivery</PageFormSectionCaption>}
                        renderContent={() => (
                            <PageFormSectionBody>
                                <FormField
                                    hasError={() => getStreetMessage().length > 0}
                                    message={getStreetMessage}
                                    renderCaption={() => <PageFormFieldCaption>Street</PageFormFieldCaption>}
                                    renderMessage={(getFieldState) => (
                                        <PageFormFieldMessage state={getFieldState}>
                                            {getStreetMessage()}
                                        </PageFormFieldMessage>
                                    )}
                                    renderControl={(getFieldState) =>
                                        renderTextField(props.streetSignal, () => getFieldState().hasError)
                                    }
                                />

                                <FormSection
                                    ariaLabel={"Payment"}
                                    renderCaption={() => <PageFormSectionCaption>Payment</PageFormSectionCaption>}
                                    renderContent={() => (
                                        <PageFormSectionBody>
                                            <FormField
                                                hasError={() => getCardMessage().length > 0}
                                                message={getCardMessage}
                                                renderCaption={() => (
                                                    <PageFormFieldCaption>Card ending</PageFormFieldCaption>
                                                )}
                                                renderMessage={(getFieldState) => (
                                                    <PageFormFieldMessage state={getFieldState}>
                                                        {getCardMessage()}
                                                    </PageFormFieldMessage>
                                                )}
                                                renderControl={(getFieldState) =>
                                                    renderTextField(props.cardSignal, () => getFieldState().hasError)
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
                            isDisabled={() => !getState().isValid}
                            type={"submit"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Order</PageButtonContent>}
                        />
                    </PageFormButtons>
                </PageFormStack>
            )}
        />
    );
};
