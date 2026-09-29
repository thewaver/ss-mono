import { FormField, FormFieldReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";
import type { FormFieldExampleProps } from "../FormFieldPage.types";

type Props = FormFieldExampleProps;

const ForeignInput = (props: { value: readonly [string, (value: string) => void] }) => {
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    return (
        <input
            className={styles.foreignInput}
            value={props.value[0]}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => props.value[1](event.currentTarget.value)}
        />
    );
};

export const ForeignExample = (props: Props) => {
    return (
        <div className={styles.fieldBox}>
            <FormField
                orientation={props.orientation}
                gap={props.gap}
                hasError={props.hasError}
                message={props.message}
                renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
                renderMessage={(state) => <PageFormFieldMessage state={state}>{props.message}</PageFormFieldMessage>}
                renderControl={() => <ForeignInput value={props.value} />}
            />
        </div>
    );
};
