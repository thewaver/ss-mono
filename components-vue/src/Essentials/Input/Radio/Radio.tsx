import { type SlotsType, defineComponent, onScopeDispose, shallowRef } from "vue";

import { type InteractionSizing, InteractionTrackerUtils, type RadioGroupEntry } from "@thewaver/ss-components";

import { BinarySwitch } from "../../../Primitives/BinarySwitch/BinarySwitch";
import type { BinarySwitchSlots } from "../../../Primitives/BinarySwitch/BinarySwitch.types";
import { PlacementItem } from "../../../Primitives/PlacementItem/PlacementItem";
import { declareProps, forwardProps } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { useRadioGroupContext } from "../RadioGroup/RadioGroup.context";
import type { RadioProps } from "./Radio.types";

const ROW_SIZING: InteractionSizing = "fit-content";
const PLACED_SIZING: InteractionSizing = "fill";

export const Radio = defineComponent(
    <T,>(props: RadioProps<T>, { slots, expose }: SlotsContext<BinarySwitchSlots>) => {
        const context = useRadioGroupContext();

        const elementRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => elementRef.value);

        const getIsDisabled = () => props.isDisabled ?? false;

        const entry: RadioGroupEntry = {
            getElementRef: () => elementRef.value,
            getIsDisabled,
            getIsReachable: () =>
                InteractionTrackerUtils.computeIsReachable(
                    getIsDisabled(),
                    props.isReachableWhenDisabled ?? false,
                    props.isFocusableWhenDisabled ?? false,
                ),
            getValue: () => props.value,
        };

        onScopeDispose(context.register(entry));

        return () => {
            const placement = context.computePlacement(entry);

            const element = (
                <BinarySwitch
                    {...{
                        ...forwardProps(props, BinarySwitch),
                        onChange: (isChecked: boolean) => {
                            context.setValue(props.value);

                            props.onChange?.(isChecked);
                        },
                    }}
                    ref={(target) => {
                        elementRef.value = toElement(target);
                    }}
                    type={"radio"}
                    name={context.getName()}
                    sizing={placement === undefined ? (props.sizing ?? ROW_SIZING) : PLACED_SIZING}
                    isChecked={context.getValue() === props.value}
                    isTabbable={context.computeIsTabbable(props.value)}
                >
                    {{ renderContent: slots.renderContent, renderDecoration: slots.renderDecoration }}
                </BinarySwitch>
            );

            return placement ? (
                <PlacementItem placement={placement}>{{ default: () => element }}</PlacementItem>
            ) : (
                element
            );
        };
    },
    {
        name: "Radio",
        slots: Object as SlotsType<BinarySwitchSlots>,
        props: declareProps<RadioProps<unknown>>({
            isDisabled: Boolean,
            isPressed: Boolean,
            hasError: Boolean,
            role: null,
            sizing: null,
            minWidth: null,
            minHeight: null,
            isReachableWhenDisabled: Boolean,
            isFocusableWhenDisabled: Boolean,
            onActivation: null,
            tooltipDefs: null,
            onChange: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            value: null,
        }),
    },
);
