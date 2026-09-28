import { Button, Checkbox, Form, FormField, TextInput } from "@thewaver/ss-components-react";
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
import type { FormExampleProps } from "../FormPage.types";

const FIELD_WIDTH = 240;
const MIN_PASSWORD_LENGTH = 8;

type Props = FormExampleProps;

const renderTextField = (state: readonly [string, (value: string) => void], hasError: boolean) => (
    <TextInput
        valueState={state}
        hasError={hasError}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
    />
);

export const SignUpExample = (props: Props) => {
    const computeEmailMessage = () => {
        if (props.emailState[0].length < 1) return "We only use it to sign you in.";

        return props.emailState[0].includes("@") ? "" : "That does not look like an email address.";
    };

    const emailMessage = computeEmailMessage();

    const passwordMessage =
        props.passwordState[0].length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    return (
        <Form
            ariaLabel={"Sign up"}
            onSubmit={props.onSubmit}
            onReset={props.onReset}
            renderContent={(state) => (
                <PageFormStack>
                    <FormField
                        hasError={emailMessage.includes("not look")}
                        message={emailMessage}
                        renderCaption={() => <PageFormFieldCaption>Email</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{emailMessage}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => renderTextField(props.emailState, fieldState.hasError)}
                    />

                    <FormField
                        hasError={passwordMessage.length > 0}
                        message={passwordMessage}
                        renderCaption={() => <PageFormFieldCaption>Password</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{passwordMessage}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => renderTextField(props.passwordState, fieldState.hasError)}
                    />

                    <FormField
                        orientation={"horizontal"}
                        hasError={!props.termsState[0]}
                        message={props.termsState[0] ? "" : "Required."}
                        renderCaption={() => <PageFormFieldCaption>Accept the terms</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>Required.</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => (
                            <Checkbox
                                checkedState={props.termsState}
                                hasError={fieldState.hasError}
                                renderContent={(flags) => <PageCheckboxContent flags={flags} />}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            isDisabled={!state.isValid}
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Sign up</PageButtonContent>}
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
