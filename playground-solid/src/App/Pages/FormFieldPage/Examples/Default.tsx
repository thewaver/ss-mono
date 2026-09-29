import { FormField, TextInput, access } from "@thewaver/ss-components-solid";
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
        <div class={styles.fieldBox}>
            <FormField
                orientation={props.orientation}
                gap={props.gap}
                hasError={props.hasError}
                isRequired={true}
                message={props.message}
                renderCaption={(getState) => (
                    <PageFormFieldCaption>Display name{getState().isRequired ? " *" : ""}</PageFormFieldCaption>
                )}
                renderMessage={(getState) => (
                    <PageFormFieldMessage state={getState}>{access(props.message)}</PageFormFieldMessage>
                )}
                renderControl={(getState) => (
                    <TextInput
                        value={props.value}
                        hasError={() => getState().hasError}
                        isRequired={() => getState().isRequired}
                        padding={() => FIELD_PADDING}
                        gap={() => FIELD_GAP}
                        computeTextStyle={computePageTextFieldTextStyle}
                        renderContent={(getFlags) => (
                            <PageTextFieldContent flags={getFlags} width={() => CONTROL_WIDTH} />
                        )}
                    />
                )}
            />
        </div>
    );
};
