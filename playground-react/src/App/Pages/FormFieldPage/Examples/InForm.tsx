import { Button, Form, FormField, TextInput } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import type { FormFieldExampleProps } from "../FormFieldPage.types";

type Props = FormFieldExampleProps;

const CONTROL_WIDTH = 240;

export const InFormExample = (props: Props) => {
    return (
        <Form
            ariaLabel={"Display name"}
            renderContent={(state) => (
                <div className={styles.formStack}>
                    <FormField
                        orientation={props.orientation}
                        gap={props.gap}
                        hasError={props.hasError}
                        message={props.message}
                        renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                        renderMessage={(fieldState) => (
                            <PageFormFieldMessage state={fieldState}>{props.message}</PageFormFieldMessage>
                        )}
                        renderControl={(fieldState) => (
                            <TextInput
                                valueState={props.valueState}
                                hasError={fieldState.hasError}
                                padding={FIELD_PADDING}
                                gap={FIELD_GAP}
                                computeTextStyle={computePageTextFieldTextStyle}
                                renderContent={(flags) => <PageTextFieldContent flags={flags} width={CONTROL_WIDTH} />}
                            />
                        )}
                    />

                    <Button
                        isDisabled={!state.isValid}
                        type={"submit"}
                        renderContent={(flags) => <PageButtonContent flags={flags}>Save</PageButtonContent>}
                    />
                </div>
            )}
        />
    );
};
