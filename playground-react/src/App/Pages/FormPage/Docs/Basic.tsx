import { useState } from "react";

import { Button, Checkbox, Form, FormField, TextInput } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageCheckboxContent } from "../../../StyledComponents/CheckboxContent/CheckboxContent";
import {
    PageFormButtons,
    PageFormFieldCaption,
    PageFormFieldMessage,
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;

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

export const BasicDocsExample = () => {
    const emailState = useState("");
    const passwordState = useState("");
    const termsState = useState(false);
    const [outcome, setOutcome] = useState("Not sent yet.");

    const hasEmailError = !emailState[0].includes("@");

    const computeEmailMessage = () => {
        if (emailState[0].length < 1) return "Enter your email.";

        return hasEmailError ? "That does not look like an email address." : "We only use it to sign you in.";
    };

    const emailMessage = computeEmailMessage();

    const passwordMessage =
        passwordState[0].length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    const isComplete = !hasEmailError && !passwordMessage && termsState[0];

    return (
        <Form
            ariaLabel={"Sign up"}
            onSubmit={() => {
                if (!isComplete) return;

                setOutcome(`Sent as ${emailState[0]}.`);
            }}
            onReset={() => {
                emailState[1]("");
                passwordState[1]("");
                termsState[1](false);
                setOutcome("Not sent yet.");
            }}
            renderContent={(state) => (
                <PageFormStack>
                    <FormField
                        hasError={hasEmailError}
                        message={emailMessage}
                        renderCaption={() => <PageFormFieldCaption>Email</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{emailMessage}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => renderTextField(emailState, fieldState.hasError)}
                    />

                    <FormField
                        hasError={passwordMessage.length > 0}
                        message={passwordMessage}
                        renderCaption={() => <PageFormFieldCaption>Password</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{passwordMessage}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => renderTextField(passwordState, fieldState.hasError)}
                    />

                    <FormField
                        orientation={"horizontal"}
                        hasError={!termsState[0]}
                        message={termsState[0] ? "" : "Required."}
                        renderCaption={() => <PageFormFieldCaption>Accept the terms</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>Required.</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => (
                            <Checkbox
                                checked={termsState}
                                hasError={fieldState.hasError}
                                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Sign up</PageButtonContent>}
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
