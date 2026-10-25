import { createSignal } from "solid-js";

import { Button, Form, FormField, TextInput, access } from "@thewaver/ss-components-solid";
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
import type { FormFieldInFormDocsExampleProps } from "../FormFieldPageSolid.types";

const HINT = "Shown to everyone who can see your posts.";
const ERROR = "That name is already taken.";

type Props = FormFieldInFormDocsExampleProps;

export const InFormDocsExample = (props: Props) => {
    const valueSignal = createSignal("");
    const [getOutcome, setOutcome] = createSignal("Not saved yet.");

    const getMessage = () => (access(props.hasError) ? ERROR : HINT);

    return (
        <Form
            ariaLabel={"Profile"}
            onSubmit={() => {
                if (access(props.hasError)) return;

                setOutcome(`Saved as ${valueSignal[0]() || "nothing"}.`);
            }}
            renderContent={(getState) => (
                <PageFormStack>
                    <FormField
                        hasError={props.hasError}
                        message={getMessage}
                        renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>{getMessage()}</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) => (
                            <TextInput
                                value={valueSignal}
                                hasError={() => getFieldState().hasError}
                                padding={FIELD_PADDING}
                                gap={FIELD_GAP}
                                computeTextStyle={computePageTextFieldTextStyle}
                                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} />}
                            />
                        )}
                    />

                    <PageFormButtons>
                        <Button
                            type={"submit"}
                            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Save</PageButtonContent>}
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
