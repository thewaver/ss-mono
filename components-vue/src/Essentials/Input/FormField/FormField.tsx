import { type SlotsType, defineComponent, onScopeDispose, useId } from "vue";

import {
    FORM_FIELD_DEFAULTS,
    type FormEntry,
    type FormFieldContextType,
    type FormFieldState,
    FormFieldStyles,
} from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { useFormContext } from "../../Form/Form.context";
import { provideFormFieldContext } from "./FormField.context";
import type { FormFieldControlProps, FormFieldProps, FormFieldSlots } from "./FormField.types";

const FormFieldControl = defineComponent(
    (props: FormFieldControlProps, { slots }) => {
        provideFormFieldContext(props.context);

        return () => slots.default?.();
    },
    { name: "FormFieldControl", props: declareProps<FormFieldControlProps>({ context: null }) },
);

export const FormField = defineComponent(
    (props: FormFieldProps, { slots }: SlotsContext<FormFieldSlots>) => {
        const messageId = useId();
        const formContext = useFormContext();

        let controlElement: HTMLElement | undefined;

        const getHasMessage = () => (props.message ?? "").length > 0;

        const entry: FormEntry = {
            getHasError: () => props.hasError ?? false,
            getFocusTarget: () => controlElement,
        };

        formContext?.register(entry);

        onScopeDispose(() => formContext?.unregister(entry));

        const fieldContext: FormFieldContextType = {
            getDescriptionId: () => (getHasMessage() ? messageId : undefined),
            registerControl: (element) => {
                controlElement = element;
            },
            unregisterControl: (element) => {
                if (controlElement === element) controlElement = undefined;
            },
        };

        return () => {
            const hasError = props.hasError ?? false;
            const hasMessage = getHasMessage();

            const state: FormFieldState = { hasError, hasMessage, isRequired: props.isRequired ?? false };

            return (
                <div
                    class={FormFieldStyles.formFieldRoot}
                    style={{
                        flexDirection:
                            (props.orientation ?? FORM_FIELD_DEFAULTS.orientation) === "horizontal" ? "row" : "column",
                        gap: `${props.gap ?? FORM_FIELD_DEFAULTS.gap}px`,
                    }}
                >
                    {callSlot(slots.renderCaption, state)}

                    <FormFieldControl context={fieldContext}>
                        {{ default: () => callSlot(slots.renderControl, state) }}
                    </FormFieldControl>

                    {hasMessage && (
                        <div id={messageId} role={hasError ? "alert" : undefined}>
                            {slots.renderMessage ? callSlot(slots.renderMessage, state) : props.message}
                        </div>
                    )}
                </div>
            );
        };
    },
    {
        name: "FormField",
        slots: Object as SlotsType<FormFieldSlots>,
        props: declareProps<FormFieldProps>({
            orientation: null,
            gap: null,
            hasError: Boolean,
            isRequired: Boolean,
            message: null,
        }),
    },
);
