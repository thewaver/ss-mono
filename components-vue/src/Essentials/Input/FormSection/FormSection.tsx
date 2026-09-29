import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef, useId } from "vue";

import {
    FORM_SECTION_DEFAULTS,
    type FormContextType,
    type FormEntry,
    type FormSectionState,
    FormSectionStyles,
    FormUtils,
} from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { provideFormContext, useFormContext } from "../../Form/Form.context";
import type { FormSectionContentProps, FormSectionProps, FormSectionSlots } from "./FormSection.types";

const FormSectionContent = defineComponent(
    (props: FormSectionContentProps, { slots }) => {
        provideFormContext(props.context);

        return () => slots.default?.();
    },
    { name: "FormSectionContent", props: declareProps<FormSectionContentProps>({ context: null }) },
);

export const FormSection = defineComponent(
    (props: FormSectionProps, { slots }: SlotsContext<FormSectionSlots>) => {
        const messageId = useId();
        const outerContext = useFormContext();

        const entries = shallowRef<FormEntry[]>([]);

        const getHasError = () => props.hasError ?? false;

        const isValid = computed(() => !getHasError() && FormUtils.computeIsValid(entries.value));

        const entry: FormEntry = {
            getHasError: () => getHasError() || !FormUtils.computeIsValid(entries.value),
            getFocusTarget: () => FormUtils.findSectionFocusTarget(entries.value),
        };

        outerContext?.register(entry);

        onScopeDispose(() => outerContext?.unregister(entry));

        const context: FormContextType = {
            register: (held) => {
                entries.value = [...entries.value, held];
            },
            unregister: (held) => {
                entries.value = entries.value.filter((other) => other !== held);
            },
            getIsValid: () => isValid.value,
            getHasSubmitted: () => outerContext?.getHasSubmitted() ?? false,
        };

        return () => {
            const hasMessage = (props.message ?? "").length > 0;

            const state: FormSectionState = { isValid: isValid.value, hasError: getHasError(), hasMessage };

            return (
                <fieldset
                    class={FormSectionStyles.formSectionRoot}
                    style={{
                        flexDirection:
                            (props.orientation ?? FORM_SECTION_DEFAULTS.orientation) === "horizontal"
                                ? "row"
                                : "column",
                        gap: `${props.gap ?? FORM_SECTION_DEFAULTS.gap}px`,
                    }}
                    aria-label={props.ariaLabel}
                    aria-describedby={hasMessage ? messageId : undefined}
                >
                    {slots.renderCaption && (
                        <legend class={FormSectionStyles.formSectionCaption}>
                            {callSlot(slots.renderCaption, state)}
                        </legend>
                    )}

                    <FormSectionContent context={context}>
                        {{ default: () => callSlot(slots.renderContent, state) }}
                    </FormSectionContent>

                    {hasMessage && (
                        <div id={messageId} role={getHasError() ? "alert" : undefined}>
                            {slots.renderMessage ? callSlot(slots.renderMessage, state) : props.message}
                        </div>
                    )}
                </fieldset>
            );
        };
    },
    {
        name: "FormSection",
        slots: Object as SlotsType<FormSectionSlots>,
        props: declareProps<FormSectionProps>({
            orientation: null,
            gap: null,
            ariaLabel: null,
            hasError: Boolean,
            message: null,
        }),
    },
);
