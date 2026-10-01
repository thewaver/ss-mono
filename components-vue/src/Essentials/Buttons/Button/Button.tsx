import { type SlotsType, defineComponent, shallowRef } from "vue";

import { BUTTON_DEFAULTS, type ButtonFlags, ButtonStyles, type InteractionActivation } from "@thewaver/ss-components";

import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { callSlot, declareProps, forwardProps } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { LabelVueUtils } from "../../Input/Label/LabelVue.utils";
import type { ButtonElementProps, ButtonProps, ButtonSlots } from "./Button.types";

const ButtonElement = defineComponent(
    (props: ButtonElementProps, { slots }: SlotsContext<InteractionControlSlots<ButtonFlags>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;
            const isPending = props.flags.isPending;
            const isRefusing = isDisabled || isPending;

            return (
                <button
                    id={props.id}
                    type={props.type ?? BUTTON_DEFAULTS.type}
                    class={ButtonStyles.buttonElement}
                    aria-label={ariaLabel.value}
                    aria-disabled={isDisabled || undefined}
                    aria-pressed={props.flags.isPressed}
                    aria-busy={isPending || undefined}
                    onClick={(e) => {
                        if (isRefusing) {
                            e.preventDefault();

                            return;
                        }

                        void props.onClick?.(e);
                    }}
                    onPointerdown={(e) => {
                        if (isRefusing) return;

                        props.onPointerDown?.(e);
                    }}
                    onPointerup={(e) => {
                        if (isRefusing) return;

                        props.onPointerUp?.(e);
                    }}
                    onPointercancel={(e) => {
                        if (isRefusing) return;

                        props.onPointerUp?.(e);
                    }}
                    onMouseenter={(e) => {
                        if (isDisabled) return;

                        props.onMouseEnter?.(e);
                    }}
                    onMouseleave={(e) => {
                        if (isDisabled) return;

                        props.onMouseLeave?.(e);
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </button>
            );
        };
    },
    {
        name: "ButtonElement",
        props: declareProps<ButtonElementProps>({
            onClick: null,
            onPointerDown: null,
            onPointerUp: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            type: null,
        }),
    },
);

export const Button = defineComponent(
    (props: ButtonProps, { slots, expose }: SlotsContext<ButtonSlots>) => {
        const isPending = shallowRef(false);
        const controlRef = shallowRef<HTMLElement>();

        exposeElement(expose, () => controlRef.value);

        const handleClick = (e: MouseEvent | KeyboardEvent) => {
            const result = props.onClick?.(e);

            if (!(result instanceof Promise)) return;

            isPending.value = true;

            void result.finally(() => {
                isPending.value = false;
            });
        };

        return () => {
            const extraFlags: ButtonFlags = { isPending: isPending.value };

            return (
                <InteractionWrapper
                    {...{
                        ...forwardProps(props, InteractionWrapper),
                        onActivation:
                            props.onActivation &&
                            ((activation: InteractionActivation) => {
                                if (isPending.value) return;

                                props.onActivation?.(activation);
                            }),
                    }}
                    extraFlags={extraFlags}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <ButtonElement
                                    ref={(target) => {
                                        setElementRef(target);
                                        controlRef.value = toElement(target);
                                    }}
                                    ariaLabel={props.ariaLabel}
                                    type={props.type}
                                    id={props.id}
                                    flags={flags}
                                    onClick={handleClick}
                                    onPointerDown={props.onPointerDown}
                                    onPointerUp={props.onPointerUp}
                                    onMouseEnter={props.onMouseEnter}
                                    onMouseLeave={props.onMouseLeave}
                                >
                                    {{ renderContent: slots.renderContent }}
                                </ButtonElement>
                            ),
                            renderDecoration: slots.renderDecoration,
                        } satisfies Partial<InteractionWrapperSlots<ButtonFlags>>
                    }
                </InteractionWrapper>
            );
        };
    },
    {
        name: "Button",
        slots: Object as SlotsType<ButtonSlots>,
        props: declareProps<ButtonProps>({
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
            onClick: null,
            onPointerDown: null,
            onPointerUp: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            type: null,
        }),
    },
);
