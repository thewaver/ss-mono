import { type SlotsType, defineComponent, shallowRef, useId } from "vue";

import {
    COLOR_INPUT_DEFAULTS,
    type ColorInputRenderProps,
    ColorInputStyles,
    ColorInputUtils,
} from "@thewaver/ss-components";
import type { Color } from "@thewaver/ss-utils";

import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { Popover } from "../../../Primitives/Popover/Popover";
import type { PopoverSlots } from "../../../Primitives/Popover/Popover.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { exposeElement, toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { ColorArea } from "../ColorArea/ColorArea";
import { FormFieldVueUtils } from "../FormField/FormFieldVue.utils";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import { Range } from "../Range/Range";
import type { ColorInputFieldProps, ColorInputProps, ColorInputSlots } from "./ColorInput.types";

const ColorInputField = defineComponent(
    (props: ColorInputFieldProps, { slots }: SlotsContext<InteractionControlSlots<ColorInputRenderProps>>) => {
        const ariaLabel = LabelVueUtils.useAriaLabel(() => props.ariaLabel);
        const ariaDescribedBy = FormFieldVueUtils.useAriaDescribedBy();

        const elementRef = shallowRef<HTMLButtonElement>();

        FormFieldVueUtils.useRegisterControl(elementRef);

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <button
                    id={props.id}
                    ref={elementRef}
                    type="button"
                    class={ColorInputStyles.colorInputField}
                    aria-label={ariaLabel.value}
                    aria-describedby={ariaDescribedBy.value}
                    aria-haspopup="dialog"
                    aria-expanded={props.isOpen}
                    aria-controls={props.isOpen ? props.popupId : undefined}
                    aria-disabled={isDisabled || undefined}
                    aria-invalid={props.flags.hasError || undefined}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onToggle();
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
        name: "ColorInputField",
        props: declareProps<ColorInputFieldProps>({
            onInput: null,
            onMouseEnter: null,
            onMouseLeave: null,
            id: null,
            ariaLabel: null,
            flags: null,
            popupId: null,
            isOpen: Boolean,
            onToggle: null,
        }),
    },
);

export const ColorInput = defineComponent(
    (props: ColorInputProps, { slots, expose }: SlotsContext<ColorInputSlots>) => {
        const popupId = useId();

        const value = useTwoWay(props, "value");
        const isOpen = useTwoWay(props, "visibility", false);

        const fieldElement = shallowRef<HTMLElement>();

        exposeElement(expose, () => fieldElement.value);

        const startingState = ColorInputUtils.computeStartingState(value.value);

        const hsv = shallowRef<Color.HSVA>(startingState.hsv);
        const notation = shallowRef<Color.Notation>(startingState.notation);
        const isUnreadable = shallowRef(startingState.isUnreadable);

        const getIsDisabled = () => props.isDisabled ?? false;

        watchAfterRender([isOpen, getIsDisabled], ([isShown, isOff]) => {
            if (isShown && isOff) isOpen.value = false;
        });

        watchAfterRender([() => value.value], ([current]) => {
            const incoming = ColorInputUtils.computeIncoming(current, hsv.value);

            isUnreadable.value = incoming.isUnreadable;

            if (incoming.notation !== undefined) notation.value = incoming.notation;

            if (incoming.hsv !== undefined) hsv.value = incoming.hsv;
        });

        watchAfterRender([hsv], ([current]) => {
            const next = ColorInputUtils.computeOutgoing(current, notation.value, value.value, isUnreadable.value);

            if (next === undefined) return;

            value.value = next;
            props.onInput?.(next);
        });

        const open = () => {
            if (getIsDisabled()) return;

            isOpen.value = true;
        };

        const dismiss = () => {
            if (!isOpen.value) return;

            isOpen.value = false;
            fieldElement.value?.focus();
        };

        const renderSurface = () => [
            <ColorArea
                hsv={hsv.value}
                onUpdate:hsv={(next: Color.HSVA) => {
                    hsv.value = next;
                }}
                sizing={"fill"}
                isDisabled={getIsDisabled()}
                ariaLabel={props.areaLabel}
                axisLabels={props.areaAxisLabels}
            >
                {{ renderContent: slots.renderArea }}
            </ColorArea>,

            <Range
                value={hsv.value.h}
                onUpdate:value={(hue: number) => {
                    hsv.value = { ...hsv.value, h: hue };
                }}
                sizing={"fill"}
                isDisabled={getIsDisabled()}
                max={ColorInputUtils.HUE_MAX}
                step={ColorInputUtils.HUE_STEP}
                ariaLabel={props.hueLabel}
            >
                {{ renderContent: slots.renderHue }}
            </Range>,
        ];

        return () => {
            const extraFlags: ColorInputRenderProps = {
                value: value.value,
                hsv: hsv.value,
                isOpen: isOpen.value,
                isUnreadable: isUnreadable.value,
            };

            return (
                <>
                    <InteractionWrapper
                        {...forwardProps(props, InteractionWrapper)}
                        ref={(target) => {
                            fieldElement.value = toElement(target);
                        }}
                        hasError={(props.hasError ?? false) || isUnreadable.value}
                        extraFlags={extraFlags}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <ColorInputField
                                        ref={setElementRef}
                                        id={props.id}
                                        ariaLabel={props.ariaLabel}
                                        popupId={popupId}
                                        isOpen={isOpen.value}
                                        flags={flags}
                                        onToggle={() => {
                                            if (isOpen.value) isOpen.value = false;
                                            else open();
                                        }}
                                        onMouseEnter={props.onMouseEnter}
                                        onMouseLeave={props.onMouseLeave}
                                    >
                                        {{ renderContent: slots.renderContent }}
                                    </ColorInputField>
                                ),
                                renderDecoration: slots.renderDecoration,
                            } satisfies Partial<InteractionWrapperSlots<ColorInputRenderProps>>
                        }
                    </InteractionWrapper>

                    <Popover
                        id={popupId}
                        role={"dialog"}
                        ariaAttributes={{ "aria-label": props.pickerLabel }}
                        isOpen={isOpen.value}
                        anchorRef={fieldElement.value}
                        placement={props.placement ?? COLOR_INPUT_DEFAULTS.placement}
                        offset={props.offset}
                        transitionDurationMs={props.transitionDurationMs}
                        hasAutoFocus={true}
                        onDismiss={(reason) => {
                            if (reason === "escape") dismiss();
                            else isOpen.value = false;
                        }}
                    >
                        {
                            {
                                renderContent: ({ visibilityTarget, transitionDurationMs }) =>
                                    callSlot(slots.renderPopup, {
                                        renderSurface,
                                        hsv,
                                        visibilityTarget,
                                        transitionDurationMs,
                                    }),
                            } satisfies PopoverSlots
                        }
                    </Popover>
                </>
            );
        };
    },
    {
        name: "ColorInput",
        inheritAttrs: false,
        slots: Object as SlotsType<ColorInputSlots>,
        props: declareProps<ColorInputProps>({
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
            "onInput": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "pickerLabel": null,
            "areaLabel": null,
            "areaAxisLabels": null,
            "hueLabel": null,
            "placement": null,
            "offset": null,
            "transitionDurationMs": null,
            "value": null,
            "onUpdate:value": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
        }),
    },
);
