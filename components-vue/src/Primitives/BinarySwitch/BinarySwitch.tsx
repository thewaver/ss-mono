import { type SlotsType, defineComponent, onMounted, onUpdated, shallowRef } from "vue";

import { type BinarySwitchFlags, BinarySwitchStyles, BinarySwitchUtils } from "@thewaver/ss-components";

import { FormFieldVueUtils } from "../../Essentials/Input/FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../../Essentials/Input/Label/LabelVue.utils";
import { callSlot, declareProps, forwardProps } from "../../Utils/propUtils";
import { exposeElement, toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { InteractionControlSlots, InteractionWrapperSlots } from "../InteractionWrapper/InteractionWrapper.types";
import type { BinarySwitchElementProps, BinarySwitchProps, BinarySwitchSlots } from "./BinarySwitch.types";

const BinarySwitchElement = defineComponent(
    (props: BinarySwitchElementProps, { slots, expose }: SlotsContext<InteractionControlSlots<BinarySwitchFlags>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const elementRef = shallowRef<HTMLInputElement>();

        exposeElement(expose, () => elementRef.value);

        FormFieldVueUtils.useRegisterControl(elementRef);

        const sync = () => {
            if (elementRef.value) {
                BinarySwitchUtils.syncElement(elementRef.value, props.isChecked, props.isMixed ?? false);
            }
        };

        onMounted(sync);

        onUpdated(sync);

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;
            const isMixed = props.isMixed ?? false;

            return (
                <>
                    {callSlot(slots.renderContent, props.flags)}

                    <input
                        id={props.id}
                        ref={(target) => {
                            elementRef.value = toElement<HTMLInputElement>(target);
                        }}
                        type={props.type}
                        name={props.name}
                        role={BinarySwitchUtils.computeRole(props.isSwitch ?? false, isMixed)}
                        class={BinarySwitchStyles.binarySwitchElement}
                        aria-label={ariaLabel.value}
                        aria-describedby={ariaDescribedBy.value}
                        aria-disabled={isDisabled || undefined}
                        aria-required={props.isRequired || undefined}
                        aria-invalid={props.flags.hasError || undefined}
                        onClick={(e) => {
                            if (isDisabled) e.preventDefault();
                        }}
                        onChange={(e) => {
                            const element = e.currentTarget as HTMLInputElement;

                            if (isDisabled) return;

                            props.onChange?.(element.checked);

                            BinarySwitchUtils.syncElement(element, props.isChecked, isMixed);
                        }}
                        onMouseenter={(e) => {
                            if (isDisabled) return;

                            props.onMouseEnter?.(e);
                        }}
                        onMouseleave={(e) => {
                            if (isDisabled) return;

                            props.onMouseLeave?.(e);
                        }}
                    />
                </>
            );
        };
    },
    {
        name: "BinarySwitchElement",
        props: declareProps<BinarySwitchElementProps>({
            onChange: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            type: null,
            isSwitch: Boolean,
            name: null,
            isRequired: Boolean,
            isChecked: Boolean,
            isMixed: Boolean,
        }),
    },
);

export const BinarySwitch = defineComponent(
    (props: BinarySwitchProps, { slots, expose }: SlotsContext<BinarySwitchSlots>) => {
        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        return () => {
            const extraFlags: BinarySwitchFlags = {
                checkedState: BinarySwitchUtils.computeCheckedState(props.isChecked, props.isMixed ?? false),
            };

            return (
                <InteractionWrapper {...forwardProps(props, InteractionWrapper)} extraFlags={extraFlags}>
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <BinarySwitchElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
                                    }}
                                    id={props.id}
                                    type={props.type}
                                    isSwitch={props.isSwitch}
                                    name={props.name}
                                    ariaLabel={props.ariaLabel}
                                    isRequired={props.isRequired}
                                    flags={flags}
                                    isChecked={props.isChecked}
                                    isMixed={props.isMixed}
                                    onChange={props.onChange}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </BinarySwitchElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<BinarySwitchFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "BinarySwitch",
        slots: Object as SlotsType<BinarySwitchSlots>,
        props: declareProps<BinarySwitchProps>({
            isDisabled: Boolean,
            isPressed: Boolean,
            hasError: Boolean,
            role: null,
            sizing: null,
            minWidth: null,
            minHeight: null,
            isReachableWhenDisabled: Boolean,
            isFocusableWhenDisabled: Boolean,
            isTabbable: Boolean,
            onActivation: null,
            tooltipDefs: null,
            onChange: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            type: null,
            isSwitch: Boolean,
            name: null,
            ariaLabel: null,
            isRequired: Boolean,
            isChecked: Boolean,
            isMixed: Boolean,
        }),
    },
);
