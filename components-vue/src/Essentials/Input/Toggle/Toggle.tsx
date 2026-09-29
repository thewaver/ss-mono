import { type SlotsType, defineComponent, shallowRef } from "vue";

import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import type { BinarySwitchSlots } from "../../../Primitives/BinarySwitch/BinarySwitch.types";
import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ToggleProps } from "./Toggle.types";

export const Toggle = defineComponent(
    (props: ToggleProps, { slots, expose }: SlotsContext<BinarySwitchSlots>) => {
        const checked = useTwoWay(props, "checked", false);

        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        return () => (
            <BinarySwitch
                {...{
                    ...forwardProps(props, BinarySwitch),
                    onChange: (isChecked: boolean) => {
                        checked.value = isChecked;

                        props.onChange?.(isChecked);
                    },
                }}
                ref={(target) => {
                    controlRef.value = toElement(target);
                }}
                type={"checkbox"}
                isSwitch={true}
                isChecked={checked.value}
            >
                {{ renderContent: slots.renderContent, renderDecoration: slots.renderDecoration }}
            </BinarySwitch>
        );
    },
    {
        name: "Toggle",
        slots: Object as SlotsType<BinarySwitchSlots>,
        props: declareProps<ToggleProps>({
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
        }),
    },
);
