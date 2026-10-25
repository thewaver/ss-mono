import { useState } from "react";

import { Button, Form, FormField, TextInput } from "@thewaver/ss-components-react";
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
    PageFormStack,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { FormFieldInFormDocsExampleProps } from "../FormFieldPageReact.types";

const HINT = "Shown to everyone who can see your posts.";
const ERROR = "That name is already taken.";

type Props = FormFieldInFormDocsExampleProps;

export const InFormDocsExample = (props: Props) => {
    const valueState = useState("");
    const [outcome, setOutcome] = useState("Not saved yet.");

    const message = props.hasError ? ERROR : HINT;

    return (
        <Form
            ariaLabel={"Profile"}
            onSubmit={() => {
                if (props.hasError) return;

                setOutcome(`Saved as ${valueState[0] || "nothing"}.`);
            }}
            renderContent={(state) => (
                <PageFormStack>
                    <FormField
                        hasError={props.hasError}
                        message={message}
                        renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{message}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => (
                            <TextInput
                                value={valueState}
                                hasError={fieldState.hasError}
                                padding={FIELD_PADDING}
                                gap={FIELD_GAP}
                                computeTextStyle={computePageTextFieldTextStyle}
                                renderContent={(flags) => <PageTextFieldContent flags={flags} />}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(flags) => <PageButtonContent flags={flags}>Save</PageButtonContent>}
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
