import { FormField, TextInput, access } from "@thewaver/ss-components";

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

export const DefaultExample = (props: Props) => {
    return (
        <div class={styles.fieldBox}>
            <FormField
                dir={props.dir}
                gap={props.gap}
                hasError={props.hasError}
                message={props.message}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(getState) => (
                    <PageFormFieldMessage state={getState}>{access(props.message)}</PageFormFieldMessage>
                )}
                renderControl={(getState) => (
                    <TextInput
                        valueSignal={props.valueSignal}
                        hasError={() => getState().hasError}
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
