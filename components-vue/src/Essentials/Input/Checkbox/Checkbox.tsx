import { type SlotsType, defineComponent, shallowRef } from "vue";

import type { CheckboxGroupEntry } from "@thewaver/ss-components";

import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import type { BinarySwitchSlots } from "../../../Primitives/BinarySwitch/BinarySwitch.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { useCheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";
import type { CheckboxProps } from "./Checkbox.types";

export const Checkbox = defineComponent(
    <T,>(props: CheckboxProps<T>, { slots, expose }: SlotsContext<BinarySwitchSlots>) => {
        const groupContext = useCheckboxGroupContext();

        const checked = useTwoWay(props, "checked", false);

        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        const getGroup = () => (props.value === undefined ? undefined : groupContext);

        const entry: CheckboxGroupEntry = {
            getValue: () => props.value,
            getIsDisabled: () => props.isDisabled ?? false,
        };

        watchAfterRender([getGroup], ([group]) => group?.register(entry));

        return () => {
            const group = getGroup();

            return (
                <BinarySwitch
                    {...{
                        ...forwardProps(props, BinarySwitch),
                        onChange: (isChecked: boolean) => {
                            if (group) group.setIsChecked(props.value, isChecked);
                            else checked.value = isChecked;

                            props.onChange?.(isChecked);
                        },
                    }}
                    ref={(target) => {
                        controlRef.value = toElement(target);
                    }}
                    type={"checkbox"}
                    isChecked={group ? group.computeIsChecked(props.value) : checked.value}
                >
                    {{ renderContent: slots.renderContent, renderDecoration: slots.renderDecoration }}
                </BinarySwitch>
            );
        };
    },
    {
        name: "Checkbox",
        slots: Object as SlotsType<BinarySwitchSlots>,
        props: declareProps<CheckboxProps>({
            "isDisabled": Boolean,
            "isPressed": Boolean,
            "hasError": Boolean,
            "role": null,
            "sizing": null,
            "minWidth": null,
            "minHeight": null,
            "isReachableWhenDisabled": Boolean,
            "isFocusableWhenDisabled": Boolean,
            "isTabbable": Boolean,
            "onActivation": null,
            "tooltipDefs": null,
            "onChange": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "isRequired": Boolean,
            "isMixed": Boolean,
            "checked": Boolean,
            "onUpdate:checked": null,
            "value": null,
        }),
    },
);
