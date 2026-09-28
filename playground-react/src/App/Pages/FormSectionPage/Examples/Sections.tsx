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
import type { FormSectionTextState, FormSectionsExampleProps } from "../FormSectionPage.types";

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;
const MISMATCH_MESSAGE = "The two passwords do not match.";

type Props = FormSectionsExampleProps;

const renderTextField = (state: FormSectionTextState, hasError?: boolean) => (
    <TextInput
        valueState={state}
        hasError={hasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
    />
);

export const SectionsExample = (props: Props) => {
    const emailMessage = props.emailState[0].includes("@") ? "" : "That does not look like an email address.";

    const passwordMessage =
        props.passwordState[0].length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    const hasMismatch = props.confirmState[0] !== props.passwordState[0];

    return (
        <Form
            ariaLabel={"Create an account"}
            onSubmit={props.onSubmit}
            onReset={props.onReset}
            renderContent={(state) => (
                <PageFormStack>
                    <FormSection
                        renderCaption={() => <PageFormSectionCaption>Who you are</PageFormSectionCaption>}
                        renderContent={() => (
                            <PageFormSectionBody>
                                <FormField
                                    hasError={emailMessage.length > 0}
                                    message={emailMessage}
                                    renderCaption={() => <PageFormFieldCaption>Email</PageFormFieldCaption>}
                                    renderMessage={(fieldState) => (
                                        <PageFormFieldMessage state={fieldState}>{emailMessage}</PageFormFieldMessage>
                                    )}
                                    renderControl={(fieldState) =>
                                        renderTextField(props.emailState, fieldState.hasError)
                                    }
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <FormSection
                        hasError={hasMismatch}
                        message={hasMismatch ? MISMATCH_MESSAGE : ""}
                        renderCaption={() => <PageFormSectionCaption>Pick a password</PageFormSectionCaption>}
                        renderMessage={(sectionState) => (
                            <PageFormFieldMessage state={sectionState}>{MISMATCH_MESSAGE}</PageFormFieldMessage>
                        )}
                        renderContent={() => (
                            <PageFormSectionBody>
                                <FormField
                                    hasError={passwordMessage.length > 0}
                                    message={passwordMessage}
                                    renderCaption={() => <PageFormFieldCaption>Password</PageFormFieldCaption>}
                                    renderMessage={(fieldState) => (
                                        <PageFormFieldMessage state={fieldState}>
                                            {passwordMessage}
                                        </PageFormFieldMessage>
                                    )}
                                    renderControl={(fieldState) =>
                                        renderTextField(props.passwordState, fieldState.hasError)
                                    }
                                />

                                <FormField
                                    renderCaption={() => <PageFormFieldCaption>Repeat it</PageFormFieldCaption>}
                                    renderControl={() => renderTextField(props.confirmState)}
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            id={"sectionsSubmit"}
                            isDisabled={!state.isValid}
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Create</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>
                </PageFormStack>
            )}
        />
    );
};
