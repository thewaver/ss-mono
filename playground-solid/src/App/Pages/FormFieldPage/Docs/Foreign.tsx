import type { Signal } from "solid-js";
import { createSignal } from "solid-js";

import { FormField, FormFieldSolidUtils } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.css";

import {
    PageFormFieldCaption,
    PageFormFieldMessage,
} from "../../../StyledComponents/FormFieldContent/FormFieldContent";

const MESSAGE = "Shown to everyone who can see your posts.";

const ForeignInput = (props: { value: Signal<string> }) => {
    const getAriaLabelledBy = FormFieldSolidUtils.resolveAriaLabelledBy();
    const getAriaDescribedBy = FormFieldSolidUtils.resolveAriaDescribedBy();

    return (
        <input
            class={styles.foreignInput}
            value={props.value[0]()}
            aria-labelledby={getAriaLabelledBy()}
            aria-describedby={getAriaDescribedBy()}
            onInput={(event) => props.value[1](event.currentTarget.value)}
        />
    );
};

export const ForeignDocsExample = () => {
    const valueSignal = createSignal("");

    return (
        <FormField
            message={MESSAGE}
            renderCaption={() => <PageFormFieldCaption>Display name</PageFormFieldCaption>}
            renderMessage={(getState) => <PageFormFieldMessage state={getState}>{MESSAGE}</PageFormFieldMessage>}
            renderControl={() => <ForeignInput value={valueSignal} />}
        />
    );
};
