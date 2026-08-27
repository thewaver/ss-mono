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
import type { FormSectionsExampleProps } from "../FormPage.types";

import { FIELD_GAP, FIELD_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;
const MISMATCH_MESSAGE = "The two passwords do not match.";

type Props = FormSectionsExampleProps;

const renderTextField = (signal: Signal<string>, getHasError?: () => boolean) => (
    <TextInput
        valueSignal={signal}
        hasError={getHasError}
        padding={() => FIELD_PADDING}
        gap={() => FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
    />
);

export const SectionsExample = (props: Props) => {
    const getEmailMessage = () =>
        props.emailSignal[0]().includes("@") ? "" : "That does not look like an email address.";

    const getPasswordMessage = () =>
        props.passwordSignal[0]().length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    const getHasMismatch = () => props.confirmSignal[0]() !== props.passwordSignal[0]();

    return (
        <Form
            ariaLabel={"Create an account"}
            onSubmit={props.onSubmit}
            onReset={props.onReset}
            renderContent={(getState) => (
                <PageFormStack>
                    <FormSection
                        renderCaption={() => <PageFormSectionCaption>Who you are</PageFormSectionCaption>}
                        renderContent={() => (
                            <PageFormSectionBody>
                                <FormField
                                    hasError={() => getEmailMessage().length > 0}
                                    message={getEmailMessage}
                                    renderCaption={() => <PageFormFieldCaption>Email</PageFormFieldCaption>}
                                    renderMessage={(getFieldState) => (
                                        <PageFormFieldMessage state={getFieldState}>
                                            {getEmailMessage()}
                                        </PageFormFieldMessage>
                                    )}
                                    renderControl={(getFieldState) =>
                                        renderTextField(props.emailSignal, () => getFieldState().hasError)
                                    }
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <FormSection
                        hasError={getHasMismatch}
                        message={() => (getHasMismatch() ? MISMATCH_MESSAGE : "")}
                        renderCaption={() => <PageFormSectionCaption>Pick a password</PageFormSectionCaption>}
                        renderMessage={(getSectionState) => (
                            <PageFormFieldMessage state={getSectionState}>{MISMATCH_MESSAGE}</PageFormFieldMessage>
                        )}
                        renderContent={() => (
                            <PageFormSectionBody>
                                <FormField
                                    hasError={() => getPasswordMessage().length > 0}
                                    message={getPasswordMessage}
                                    renderCaption={() => <PageFormFieldCaption>Password</PageFormFieldCaption>}
                                    renderMessage={(getFieldState) => (
                                        <PageFormFieldMessage state={getFieldState}>
                                            {getPasswordMessage()}
                                        </PageFormFieldMessage>
                                    )}
                                    renderControl={(getFieldState) =>
                                        renderTextField(props.passwordSignal, () => getFieldState().hasError)
                                    }
                                />

                                <FormField
                                    renderCaption={() => <PageFormFieldCaption>Repeat it</PageFormFieldCaption>}
                                    renderControl={() => renderTextField(props.confirmSignal)}
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            id={() => "sectionsSubmit"}
                            isDisabled={() => !getState().isValid}
                            type={"submit"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Create</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>
                </PageFormStack>
            )}
        />
    );
};
