import { type SlotsType, defineComponent, shallowRef } from "vue";

import { TextField } from "../../../Primitives/TextField/TextField";
import type { TextFieldSlots } from "../../../Primitives/TextField/TextField.types";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { TextAreaProps } from "./TextArea.types";

export const TextArea = defineComponent(
    (props: TextAreaProps, { slots, expose }: SlotsContext<TextFieldSlots>) => {
        const value = useTwoWay(props, "value", "");

        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        return () => (
            <TextField
                {...{
                    ...forwardProps(props, TextField),
                    "value": value.value,
                    "onUpdate:value": (next: string) => {
                        value.value = next;
                    },
                }}
                ref={(target) => {
                    controlRef.value = toElement(target);
                }}
                element={"textarea"}
            >
                {
                    {
                        renderContent: slots.renderContent,
                        renderPlaceholder: slots.renderPlaceholder,
                        renderLeading: slots.renderLeading,
                        renderTrailing: slots.renderTrailing,
                        renderDecoration: slots.renderDecoration,
                    } satisfies Partial<TextFieldSlots>
                }
            </TextField>
        );
    },
    {
        name: "TextArea",
        slots: Object as SlotsType<TextFieldSlots>,
        props: declareProps<TextAreaProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "computeMaskedText": null,
            "computeTextStyle": null,
            "onInput": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "autoComplete": null,
            "inputMode": null,
            "placeholderHint": null,
            "isAutoSizing": Boolean,
            "minRows": null,
            "maxRows": null,
            "padding": null,
            "gap": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);
