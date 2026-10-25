import { useState } from "react";

import { FormField, FormFieldReactUtils } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";

const MESSAGE = "Shown to everyone who can see your posts.";

const ForeignInput = (props: { value: readonly [string, (value: string) => void] }) => {
    const ariaLabelledBy = FormFieldReactUtils.useAriaLabelledBy();
    const ariaDescribedBy = FormFieldReactUtils.useAriaDescribedBy();

    return (
        <input
            className={styles.foreignInput}
            value={props.value[0]}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => props.value[1](event.currentTarget.value)}
        />
    );
};

export const ForeignDocsExample = () => {
    const valueState = useState("");

    return (
        <FormField
            message={MESSAGE}
            renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
            renderMessage={(state) => <PageFormFieldMessage state={state}>{MESSAGE}</PageFormFieldMessage>}
            renderControl={() => <ForeignInput value={valueState} />}
        />
    );
};
