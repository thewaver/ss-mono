import { FormField, TextInput } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

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

export const DefaultExample = (props: Props) => {
    return (
        <div className={styles.fieldBox}>
            <FormField
                orientation={props.orientation}
                gap={props.gap}
                hasError={props.hasError}
                isRequired={true}
                message={props.message}
                renderCaption={(state) => (
                    <PageFormFieldCaption>Display name{state.isRequired ? " *" : ""}</PageFormFieldCaption>
                )}
                renderMessage={(state) => <PageFormFieldMessage state={state}>{props.message}</PageFormFieldMessage>}
                renderControl={(state) => (
                    <TextInput
                        value={props.value}
                        hasError={state.hasError}
                        isRequired={state.isRequired}
                        padding={FIELD_PADDING}
                        gap={FIELD_GAP}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(flags) => <PageTextFieldContent flags={flags} width={CONTROL_WIDTH} />}
                    />
                )}
            />
        </div>
    );
};
