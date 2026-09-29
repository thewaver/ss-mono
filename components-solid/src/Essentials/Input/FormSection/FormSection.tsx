import { Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    FORM_SECTION_DEFAULTS,
    type FormEntry,
    type FormSectionState,
    FormUtils,
    FormSectionStyles as styles,
} from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import { FormContextProvider, useFormContext } from "../../Form/Form.context";
import type { FormSectionProps } from "./FormSectionSolid.types";

export const FormSection = (props: FormSectionProps) => {
    const messageId = createUniqueId();
    const outerContext = useFormContext();

    const [getEntries, setEntries] = createSignal<FormEntry[]>([]);

    const getHasError = () => access(props.hasError) ?? false;

    const getHasMessage = () => (access(props.message) ?? "").length > 0;

    const getIsValid = createMemo(() => !getHasError() && FormUtils.computeIsValid(getEntries()));

    const getState = createMemo((): FormSectionState => ({
        isValid: getIsValid(),
        hasError: getHasError(),
        hasMessage: getHasMessage(),
    }));

    if (outerContext) {
        const entry: FormEntry = {
            getHasError: () => !getIsValid(),
            getFocusTarget: () => FormUtils.findSectionFocusTarget(getEntries()),
        };

        outerContext.register(entry);

        onCleanup(() => outerContext.unregister(entry));
    }

    return (
        <fieldset
            class={styles.formSectionRoot}
            style={{
                "flex-direction":
                    (access(props.orientation) ?? FORM_SECTION_DEFAULTS.orientation) === "horizontal"
                        ? "row"
                        : "column",
                "gap": `${access(props.gap) ?? FORM_SECTION_DEFAULTS.gap}px`,
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
