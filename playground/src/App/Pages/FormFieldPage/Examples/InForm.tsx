import { Button, Form, FormField, TextInput, access } from "@thewaver/ss-components";

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

import { FIELD_GAP, FIELD_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";
import * as styles from "../FormFieldPage.css";

type Props = FormFieldExampleProps;

const CONTROL_WIDTH = 240;

export const InFormExample = (props: Props) => {
    return (
        <Form
            ariaLabel={"Display name"}
            renderContent={(getState) => (
                <div class={styles.formStack}>
                    <FormField
                        dir={props.dir}
                        gap={props.gap}
                        hasError={props.hasError}
                        message={props.message}
                        renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                        renderMessage={(getFieldState) => (
                            <PageFormFieldMessage state={getFieldState}>{access(props.message)}</PageFormFieldMessage>
                        )}
                        renderControl={(getFieldState) => (
                            <TextInput
                                valueSignal={props.valueSignal}
                                hasError={() => getFieldState().hasError}
                                padding={() => FIELD_PADDING}
                                gap={() => FIELD_GAP}
                                computeTextStyle={computePageTextFieldTextStyle}
                                renderContent={(getFlags) => (
                                    <PageTextFieldContent flags={getFlags} width={() => CONTROL_WIDTH} />
                                )}
                            />
                        )}
                    />

                    <Button
                        isDisabled={() => !getState().isValid}
                        type={"submit"}
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Save</PageButtonContent>}
                    />
                </div>
            )}
        />
    );
};
