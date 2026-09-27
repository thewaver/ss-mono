import { type ReactNode, useRef, useState } from "react";

import type { FormFieldState, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

import { Button, Checkbox, Form, FormField, FormFieldReactUtils, TextField } from "../../src";

const MIN_PASSWORD_LENGTH = 8;

const Frame = ({ flags }: { flags: InteractionFlags<TextFieldFlags> }) => (
    <div style={{ width: 240, height: 32, border: `1px solid ${flags.hasError ? "red" : "black"}` }} />
);

const Box = ({ flags }: { flags: InteractionFlags }) => (
    <span
        style={{
            display: "block",
            width: 20,
            height: 20,
            border: `1px solid ${flags.hasError ? "red" : "black"}`,
        }}
    />
);

const Caption = ({ children }: { children: ReactNode }) => <span>{children}</span>;

const Message = ({ state, children }: { state: FormFieldState; children: ReactNode }) => (
    <span style={{ color: state.hasError ? "red" : "gray" }}>{children}</span>
);

const renderTextField = (valueState: readonly [string, (value: string) => void], hasError: boolean, id?: string) => (
    <TextField
        id={id}
        element="input"
        padding={8}
        valueState={valueState}
        hasError={hasError}
        renderContent={(flags) => <Frame flags={flags} />}
    />
);

export const SignUp = () => {
    const emailState = useState("");
    const passwordState = useState("");
    const termsState = useState(false);
    const [outcome, setOutcome] = useState("not submitted");

    const [email] = emailState;
    const [password] = passwordState;
    const [hasTerms] = termsState;

    const emailMessage =
        email.length < 1
            ? "We only use it to sign you in."
            : email.includes("@")
              ? ""
              : "That does not look like an email address.";
    const passwordMessage = password.length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;

    return (
        <>
            <Form
                ariaLabel="Sign up"
                onSubmit={() => setOutcome(`submitted as ${email}`)}
                onReset={() => setOutcome("not submitted")}
                renderContent={(state) => (
                    <>
                        <FormField
                            hasError={emailMessage.includes("not look")}
                            message={emailMessage}
                            renderCaption={() => <Caption>Email</Caption>}
                            renderMessage={(fieldState) => <Message state={fieldState}>{emailMessage}</Message>}
                            renderControl={(fieldState) => renderTextField(emailState, fieldState.hasError, "email")}
                        />
                        <FormField
                            hasError={passwordMessage.length > 0}
                            message={passwordMessage}
                            renderCaption={() => <Caption>Password</Caption>}
                            renderMessage={(fieldState) => <Message state={fieldState}>{passwordMessage}</Message>}
                            renderControl={(fieldState) =>
                                renderTextField(passwordState, fieldState.hasError, "password")
                            }
                        />
                        <FormField
                            orientation="horizontal"
                            hasError={!hasTerms}
                            isRequired={true}
                            message={hasTerms ? "" : "Required."}
                            renderCaption={() => <Caption>Accept the terms</Caption>}
                            renderControl={(fieldState) => (
                                <Checkbox
                                    id="terms"
                                    ariaLabel="Accept the terms"
                                    checkedState={termsState}
                                    hasError={fieldState.hasError}
                                    isRequired={fieldState.isRequired}
                                    renderContent={(flags) => <Box flags={flags} />}
                                />
                            )}
                        />
                        <Button
                            id="submit"
                            type="submit"
                            isDisabled={!state.isValid}
                            renderContent={() => <span>Sign up</span>}
                        />
                        <Button id="reset" type="reset" renderContent={() => <span>Reset</span>} />
                        <output data-readout="state">
                            {`valid: ${state.isValid} | submitted: ${state.hasSubmitted}`}
                        </output>
                    </>
                )}
            />
            <output data-readout="outcome">{outcome}</output>
        </>
    );
};

export const FocusOnError = ({ initialPlan = "" }: { initialPlan?: string }) => {
    const planState = useState(initialPlan);
    const topicState = useState("");
    const [submissions, setSubmissions] = useState(0);

    return (
        <>
            <button type="button" id="outside">
                Outside
            </button>
            <Form
                ariaLabel="Newsletter"
                onSubmit={() => setSubmissions((count) => count + 1)}
                renderContent={(state) => {
                    const planMessage = state.hasSubmitted && planState[0] === "" ? "Pick a plan." : "";
                    const topicMessage = state.hasSubmitted && topicState[0] === "" ? "Pick a topic." : "";

                    return (
                        <>
                            <FormField
                                hasError={planMessage.length > 0}
                                message={planMessage}
                                renderCaption={() => <Caption>Plan</Caption>}
                                renderControl={(fieldState) => renderTextField(planState, fieldState.hasError, "plan")}
                            />
                            <FormField
                                hasError={topicMessage.length > 0}
                                message={topicMessage}
                                renderCaption={() => <Caption>Topic</Caption>}
                                renderControl={(fieldState) =>
                                    renderTextField(topicState, fieldState.hasError, "topic")
                                }
                            />
                            <Button id="submit" type="submit" renderContent={() => <span>Subscribe</span>} />
                        </>
                    );
                }}
            />
            <output data-readout="submissions">{submissions}</output>
        </>
    );
};

const ForeignInput = () => {
    const ref = useRef<HTMLInputElement>(null);
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy("own-hint");

    FormFieldReactUtils.useRegisterControl(ref);

    return <input ref={ref} id="foreign" aria-describedby={ariaDescribedBy} />;
};

export const Foreign = () => {
    const [hasError, setHasError] = useState(true);

    return (
        <Form
            ariaLabel="Foreign"
            renderContent={() => (
                <>
                    <span id="own-hint">A hint of the input's own</span>
                    <FormField
                        hasError={hasError}
                        message={hasError ? "Something is off." : ""}
                        renderControl={() => <ForeignInput />}
                    />
                    <button type="button" id="fix" onClick={() => setHasError(false)}>
                        Fix
                    </button>
                    <Button id="submit" type="submit" renderContent={() => <span>Send</span>} />
                </>
            )}
        />
    );
};
