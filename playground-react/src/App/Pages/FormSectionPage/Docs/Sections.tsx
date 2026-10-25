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
const MIN_PASSWORD_LENGTH = 8;
const MISMATCH_MESSAGE = "The two passwords do not match.";

const renderTextField = (state: readonly [string, (value: string) => void], hasError?: boolean) => (
    <TextInput
        value={state}
        hasError={hasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
    />
);

export const SectionsDocsExample = () => {
    const emailState = useState("");
    const passwordState = useState("");
    const confirmState = useState("");
    const [outcome, setOutcome] = useState("Not sent yet.");

    const emailMessage = emailState[0].includes("@") ? "" : "That does not look like an email address.";

    const passwordMessage =
        passwordState[0].length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    const hasMismatch = confirmState[0] !== passwordState[0];

    const isComplete = !emailMessage && !passwordMessage && !hasMismatch;

    return (
        <Form
            ariaLabel={"Create an account"}
            onSubmit={() => {
                if (!isComplete) return;

                setOutcome(`Sent as ${emailState[0]}.`);
            }}
            onReset={() => {
                emailState[1]("");
                passwordState[1]("");
                confirmState[1]("");
                setOutcome("Not sent yet.");
            }}
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
                                    renderControl={(fieldState) => renderTextField(emailState, fieldState.hasError)}
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
                                    renderControl={(fieldState) => renderTextField(passwordState, fieldState.hasError)}
                                />

                                <FormField
                                    renderCaption={() => <PageFormFieldCaption>Repeat it</PageFormFieldCaption>}
                                    renderControl={() => renderTextField(confirmState)}
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            id={"sectionsSubmit"}
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Create</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
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
