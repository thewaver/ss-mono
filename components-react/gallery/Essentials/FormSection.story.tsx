import { type ReactNode, useState } from "react";

import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

import { Button, Form, FormField, FormSection, TextField } from "../../src";

const MIN_PASSWORD_LENGTH = 8;
const MISMATCH_MESSAGE = "The two passwords do not match.";

const Frame = ({ flags }: { flags: InteractionFlags<TextFieldFlags> }) => (
    <div style={{ width: 240, height: 32, border: `1px solid ${flags.hasError ? "red" : "black"}` }} />
);

const Caption = ({ children }: { children: ReactNode }) => <span>{children}</span>;

const renderTextField = (valueState: readonly [string, (value: string) => void], id: string, hasError?: boolean) => (
    <TextField
        id={id}
        element="input"
        padding={8}
        valueState={valueState}
        hasError={hasError}
        renderContent={(flags) => <Frame flags={flags} />}
    />
);

export const Sections = () => {
    const emailState = useState("");
    const passwordState = useState("");
    const confirmState = useState("");

    const emailMessage = emailState[0].includes("@") ? "" : "That does not look like an email address.";
    const passwordMessage =
        passwordState[0].length >= MIN_PASSWORD_LENGTH ? "" : `At least ${MIN_PASSWORD_LENGTH} characters.`;
    const hasMismatch = confirmState[0] !== passwordState[0];

    return (
        <Form
            ariaLabel="Create an account"
            renderContent={(state) => (
                <>
                    <FormSection
                        renderCaption={() => <Caption>Who you are</Caption>}
                        renderContent={() => (
                            <FormField
                                hasError={emailMessage.length > 0}
                                message={emailMessage}
                                renderCaption={() => <Caption>Email</Caption>}
                                renderControl={(fieldState) =>
                                    renderTextField(emailState, "email", fieldState.hasError)
                                }
                            />
                        )}
                    />
                    <FormSection
                        hasError={hasMismatch}
                        message={hasMismatch ? MISMATCH_MESSAGE : ""}
                        renderCaption={() => <Caption>Pick a password</Caption>}
                        renderContent={() => (
                            <>
                                <FormField
                                    hasError={passwordMessage.length > 0}
                                    message={passwordMessage}
                                    renderCaption={() => <Caption>Password</Caption>}
                                    renderControl={(fieldState) =>
                                        renderTextField(passwordState, "password", fieldState.hasError)
                                    }
                                />
                                <FormField
                                    renderCaption={() => <Caption>Repeat it</Caption>}
                                    renderControl={() => renderTextField(confirmState, "confirm")}
                                />
                            </>
                        )}
                    />
                    <Button
                        id="submit"
                        type="submit"
                        isDisabled={!state.isValid}
                        isReachableWhenDisabled={true}
                        renderContent={() => <span>Create</span>}
                    />
                </>
            )}
        />
    );
};

export const Nested = () => {
    const streetState = useState("");
    const cardState = useState("");

    const streetMessage = streetState[0].trim().length > 0 ? "" : "We need somewhere to send it.";
    const cardMessage = /^\d{4}$/.test(cardState[0]) ? "" : "The last 4 digits, and nothing else.";

    return (
        <Form
            ariaLabel="Delivery"
            renderContent={(state) => (
                <>
                    <FormSection
                        ariaLabel="Delivery"
                        renderContent={(outerState) => (
                            <>
                                <FormField
                                    hasError={streetMessage.length > 0}
                                    message={streetMessage}
                                    renderControl={(fieldState) =>
                                        renderTextField(streetState, "street", fieldState.hasError)
                                    }
                                />
                                <FormSection
                                    ariaLabel="Payment"
                                    renderContent={(innerState) => (
                                        <>
                                            <FormField
                                                hasError={cardMessage.length > 0}
                                                message={cardMessage}
                                                renderControl={(fieldState) =>
                                                    renderTextField(cardState, "card", fieldState.hasError)
                                                }
                                            />
                                            <output data-readout="inner">{String(innerState.isValid)}</output>
                                        </>
                                    )}
                                />
                                <output data-readout="outer">{String(outerState.isValid)}</output>
                            </>
                        )}
                    />
                    <Button id="submit" type="submit" renderContent={() => <span>Order</span>} />
                    <output data-readout="form">{String(state.isValid)}</output>
                </>
            )}
        />
    );
};
