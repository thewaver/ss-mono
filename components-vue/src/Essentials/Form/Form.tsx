import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { type FormEntry, type FormState, FormUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { provideFormContext } from "./Form.context";
import type { FormProps, FormSlots } from "./Form.types";

export const Form = defineComponent(
    (props: FormProps, { slots }: SlotsContext<FormSlots>) => {
        const entries = shallowRef<FormEntry[]>([]);
        const hasSubmitted = shallowRef(false);
        const focusRequest = shallowRef(0);

        const isValid = computed(() => FormUtils.computeIsValid(entries.value));

        provideFormContext({
            register: (entry) => {
                entries.value = [...entries.value, entry];
            },
            unregister: (entry) => {
                entries.value = entries.value.filter((held) => held !== entry);
            },
            getIsValid: () => isValid.value,
            getHasSubmitted: () => hasSubmitted.value,
        });

        watchAfterRender([focusRequest], ([request]) => {
            if (request < 1) return;

            FormUtils.findErrorFocusTarget(entries.value)?.focus();
        });

        return () => {
            const state: FormState = { isValid: isValid.value, hasSubmitted: hasSubmitted.value };

            return (
                <form
                    id={props.id}
                    name={props.name}
                    aria-label={props.ariaLabel}
                    aria-labelledby={props.ariaLabelledBy}
                    novalidate
                    onSubmit={(e) => {
                        e.preventDefault();

                        hasSubmitted.value = true;
                        focusRequest.value += 1;

                        props.onSubmit?.();
                    }}
                    onReset={(e) => {
                        e.preventDefault();

                        hasSubmitted.value = false;

                        props.onReset?.();
                    }}
                >
                    {callSlot(slots.renderContent, state)}
                </form>
            );
        };
    },
    {
        name: "Form",
        slots: Object as SlotsType<FormSlots>,
        props: declareProps<FormProps>({
            id: null,
            name: null,
            ariaLabel: null,
            ariaLabelledBy: null,
            onSubmit: null,
            onReset: null,
        }),
    },
);
