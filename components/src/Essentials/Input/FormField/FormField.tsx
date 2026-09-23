import { Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { access } from "../../../Utils/propUtils";
import { useFormContext } from "../../Form/Form.context";
import { FORM_FIELD_DEFAULTS } from "./FormField.const";
import { FormFieldContextProvider } from "./FormField.context";
import type { FormFieldProps, FormFieldState } from "./FormField.types";

import * as styles from "./FormField.css";

export const FormField = (props: FormFieldProps) => {
    const messageId = createUniqueId();
    const formContext = useFormContext();

    const [getControlRef, setControlRef] = createSignal<HTMLElement>();

    const getHasError = () => access(props.hasError) ?? false;

    const getHasMessage = () => (access(props.message) ?? "").length > 0;

    const getIsRequired = () => access(props.isRequired) ?? false;

    const getState = createMemo((): FormFieldState => ({
        hasError: getHasError(),
        hasMessage: getHasMessage(),
        isRequired: getIsRequired(),
    }));

    if (formContext) {
        const entry = { getHasError, getFocusTarget: getControlRef };

        formContext.register(entry);

        onCleanup(() => formContext.unregister(entry));
    }

    return (
        <div
            class={styles.formFieldRoot}
            style={{
                "flex-direction":
                    (access(props.orientation) ?? FORM_FIELD_DEFAULTS.orientation) === "horizontal" ? "row" : "column",
                "gap": `${access(props.gap) ?? FORM_FIELD_DEFAULTS.gap}px`,
            }}
        >
            {props.renderCaption?.(getState)}

            <FormFieldContextProvider
                value={{
                    getDescriptionId: () => (getHasMessage() ? messageId : undefined),
                    registerControl: (element) => setControlRef(element),
                    unregisterControl: (element) => {
                        if (getControlRef() === element) setControlRef(undefined);
                    },
                }}
            >
                {props.renderControl(getState)}
            </FormFieldContextProvider>

            <Show when={getHasMessage()}>
                <div id={messageId} role={getHasError() ? "alert" : undefined}>
                    {props.renderMessage?.(getState) ?? access(props.message)}
                </div>
            </Show>
        </div>
    );
};
