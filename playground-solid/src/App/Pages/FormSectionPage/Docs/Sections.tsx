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
const MIN_PASSWORD_LENGTH = 8;
const MISMATCH_MESSAGE = "The two passwords do not match.";

const renderTextField = (signal: Signal<string>, getHasError?: () => boolean) => (
    <TextInput
        value={signal}
        hasError={getHasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
    />
);

export const SectionsDocsExample = () => {
    const emailSignal = createSignal("");
    const passwordSignal = createSignal("");
    const confirmSignal = createSignal("");
    const [getOutcome, setOutcome] = createSignal("Not sent yet.");

    const getEmailMessage = () => (emailSignal[0]().includes("@") ? "" : "That does not look like an email address.");

    const getPasswordMessage = () =>
        passwordSignal[0]().length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    const getHasMismatch = () => confirmSignal[0]() !== passwordSignal[0]();

    const getIsComplete = () => !getEmailMessage() && !getPasswordMessage() && !getHasMismatch();

    return (
        <Form
            ariaLabel={"Create an account"}
            onSubmit={() => {
                if (!getIsComplete()) return;

                setOutcome(`Sent as ${emailSignal[0]()}.`);
            }}
            onReset={() => {
                emailSignal[1]("");
                passwordSignal[1]("");
                confirmSignal[1]("");
                setOutcome("Not sent yet.");
            }}
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
                                        renderTextField(emailSignal, () => getFieldState().hasError)
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
                                        renderTextField(passwordSignal, () => getFieldState().hasError)
                                    }
                                />

                                <FormField
                                    renderCaption={() => <PageFormFieldCaption>Repeat it</PageFormFieldCaption>}
                                    renderControl={() => renderTextField(confirmSignal)}
                                />
                            </PageFormSectionBody>
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            id={"sectionsSubmit"}
                            type={"submit"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Create</PageButtonContent>}
                        />

                        <Button
                            type={"reset"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
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
