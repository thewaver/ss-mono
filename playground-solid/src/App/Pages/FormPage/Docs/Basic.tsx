import type { Signal } from "solid-js";
import { createSignal } from "solid-js";

import { Button, Checkbox, Form, FormField, TextInput } from "@thewaver/ss-components-solid";
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

export const BasicDocsExample = () => {
    const emailSignal = createSignal("");
    const passwordSignal = createSignal("");
    const termsSignal = createSignal(false);
    const [getOutcome, setOutcome] = createSignal("Not sent yet.");

    const getHasEmailError = () => !emailSignal[0]().includes("@");

    const getEmailMessage = () => {
        if (emailSignal[0]().length < 1) return "Enter your email.";

        return getHasEmailError() ? "That does not look like an email address." : "We only use it to sign you in.";
    };

    const getPasswordMessage = () =>
        passwordSignal[0]().length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    const getIsComplete = () => !getHasEmailError() && !getPasswordMessage() && termsSignal[0]();

    return (
        <Form
            ariaLabel={"Sign up"}
            onSubmit={() => {
                if (!getIsComplete()) return;

                setOutcome(`Sent as ${emailSignal[0]()}.`);
            }}
            onReset={() => {
                emailSignal[1]("");
                passwordSignal[1]("");
                termsSignal[1](false);
                setOutcome("Not sent yet.");
            }}
            renderContent={(getState) => (
                <PageFormStack>
                    <FormField
                        hasError={getHasEmailError}
                        message={getEmailMessage}
                        renderCaption={() => <PageFormFieldCaption>Email</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>{getEmailMessage()}</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) => renderTextField(emailSignal, () => getFieldState().hasError)}
                    />

                    <FormField
                        hasError={() => getPasswordMessage().length > 0}
                        message={getPasswordMessage}
                        renderCaption={() => <PageFormFieldCaption>Password</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>{getPasswordMessage()}</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) =>
                            renderTextField(passwordSignal, () => getFieldState().hasError)
                        }
                    />

                    <FormField
                        orientation={"horizontal"}
                        hasError={() => !termsSignal[0]()}
                        message={() => (termsSignal[0]() ? "" : "Required.")}
                        renderCaption={() => <PageFormFieldCaption>Accept the terms</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>Required.</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) => (
                            <Checkbox
                                checked={termsSignal}
                                hasError={() => getFieldState().hasError}
                                renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>Sign up</PageButtonContent>
                            )}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        />
                    </PageFormButtons>

                    <div class={exampleStyles.exampleReadout}>
                        {`${getState().isValid ? "Ready to send." : "Some fields need attention."} ${getOutcome()}`}
                    </div>
                </PageFormStack>
            )}
        />
    );
};
