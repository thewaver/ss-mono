import type { Signal } from "solid-js";

import { FormField, FormFieldSolidUtils, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import type { FormFieldExampleProps } from "../FormFieldPage.types";

type Props = FormFieldExampleProps;

const ForeignInput = (props: { value: Signal<string> }) => {
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    return (
        <input
            class={styles.foreignInput}
            value={props.value[0]()}
            aria-describedby={getAriaDescribedBy()}
            onInput={(event) => props.value[1](event.currentTarget.value)}
        />
    );
};

export const ForeignExample = (props: Props) => {
    return (
        <div class={styles.fieldBox}>
            <FormField
                orientation={props.orientation}
                gap={props.gap}
                hasError={props.hasError}
                message={props.message}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(getState) => (
                    <PageFormFieldMessage state={getState}>{access(props.message)}</PageFormFieldMessage>
                )}
                renderControl={() => <ForeignInput value={props.value} />}
            />
        </div>
    );
};
