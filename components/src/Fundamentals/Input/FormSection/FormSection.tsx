import { Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { access } from "../../../Utils/propUtils";
import { FormContextProvider, useFormContext } from "../../Form/Form.context";
import type { FormEntry } from "../../Form/Form.context.types";
import type { FormSectionProps, FormSectionState } from "./FormSection.types";

import * as styles from "./FormSection.css";

const DEFAULT_FORM_SECTION_DIR = "column";
const DEFAULT_FORM_SECTION_GAP = 5;

export const FormSection = (props: FormSectionProps) => {
    const messageId = createUniqueId();
    const outerContext = useFormContext();

    const [getEntries, setEntries] = createSignal<FormEntry[]>([]);

    const getHasError = () => access(props.hasError) ?? false;

    const getHasMessage = () => (access(props.message) ?? "").length > 0;

    const getIsValid = createMemo(() => !getHasError() && getEntries().every((entry) => !entry.getHasError()));

    const getState = createMemo((): FormSectionState => ({
        isValid: getIsValid(),
        hasError: getHasError(),
        hasMessage: getHasMessage(),
    }));

    if (outerContext) {
        const entry = { getHasError: () => !getIsValid() };

        outerContext.register(entry);

        onCleanup(() => outerContext.unregister(entry));
    }

    return (
        <fieldset
            class={styles.formSectionRoot}
            style={{
                "flex-direction": access(props.dir) ?? DEFAULT_FORM_SECTION_DIR,
                "gap": `${access(props.gap) ?? DEFAULT_FORM_SECTION_GAP}px`,
            }}
            aria-label={access(props.ariaLabel)}
            aria-describedby={getHasMessage() ? messageId : undefined}
        >
            <Show when={props.renderCaption}>
                <legend class={styles.formSectionCaption}>{props.renderCaption?.(getState)}</legend>
            </Show>

            <FormContextProvider
                value={{
                    register: (entry) => setEntries((prev) => [...prev, entry]),
                    unregister: (entry) => setEntries((prev) => prev.filter((held) => held !== entry)),
                    getIsValid,
                    getHasSubmitted: () => outerContext?.getHasSubmitted() ?? false,
                }}
            >
                {props.renderContent(getState)}
            </FormContextProvider>

            <Show when={getHasMessage()}>
                <div id={messageId} role={getHasError() ? "alert" : undefined}>
                    {props.renderMessage?.(getState) ?? access(props.message)}
                </div>
            </Show>
        </fieldset>
    );
};
