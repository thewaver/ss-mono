import type { Signal } from "solid-js";
import { createSignal } from "solid-js";

import { Button, Form, FormField, FormSection, TextInput } from "@thewaver/ss-components-solid";
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

const renderTextField = (signal: Signal<string>, getHasError: () => boolean) => (
    <TextInput
        value={signal}
        hasError={getHasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
    />
);

export const NestedDocsExample = () => {
    const streetSignal = createSignal("");
    const cardSignal = createSignal("");
    const [getOutcome, setOutcome] = createSignal("Not ordered yet.");

    const getStreetMessage = () => (streetSignal[0]().trim().length > 0 ? "" : "We need somewhere to send it.");

    const getCardMessage = () =>
        /^\d{4}$/.test(cardSignal[0]()) ? "" : `The last ${CARD_DIGITS} digits, and nothing else.`;

    return (
        <Form
            ariaLabel={"Delivery"}
            onSubmit={() => {
                if (getStreetMessage() || getCardMessage()) return;

                setOutcome(`Ordered to ${streetSignal[0]().trim()}.`);
            }}
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
                                        renderTextField(streetSignal, () => getFieldState().hasError)
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
                                                    renderTextField(cardSignal, () => getFieldState().hasError)
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
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Order</PageButtonContent>}
                        />
                    </PageFormButtons>

                    <div class={exampleStyles.exampleReadout} data-readout>
                        {`${getState().isValid ? "Ready to send." : "Some fields need attention."} ${getOutcome()}`}
                    </div>
                </PageFormStack>
            )}
        />
    );
};
