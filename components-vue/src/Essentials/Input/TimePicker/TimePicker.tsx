import { type SlotsType, defineComponent, nextTick, shallowRef, useId } from "vue";

import { type PopupTriggerFlags, TIME_PICKER_DEFAULTS } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { Popover } from "../../../Primitives/Popover/Popover";
import type { PopoverSlots } from "../../../Primitives/Popover/Popover.types";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { Clock } from "../Clock/Clock";
import type { ClockSlots } from "../Clock/Clock.types";
import { TimeInput } from "../TimeInput/TimeInput";
import type { TimeInputMeridiem, TimeInputSlots } from "../TimeInput/TimeInput.types";
import type { TimePickerProps, TimePickerSlots } from "./TimePicker.types";

export const TimePicker = defineComponent(
    (props: TimePickerProps, { slots }: SlotsContext<TimePickerSlots>) => {
        const value = useTwoWay(props, "value");
        const isOpen = useTwoWay(props, "visibility", false);

        const popupId = useId();

        const rootRef = shallowRef<HTMLDivElement>();

        let isFocusReturned = false;

        const getIsDisabled = () => props.isDisabled ?? false;

        const dismiss = () => {
            if (!isOpen.value) return;

            isFocusReturned = true;
            isOpen.value = false;
        };

        const open = () => {
            if (getIsDisabled()) return;

            isOpen.value = true;
        };

        watchAfterRender([isOpen, getIsDisabled], ([isShown, isDisabled]) => {
            if (isShown && isDisabled) isOpen.value = false;
        });

        watchAfterRender([isOpen], ([isShown]) => {
            if (isShown || !isFocusReturned) return;

            isFocusReturned = false;

            void nextTick(() => rootRef.value?.querySelector("input")?.focus());
        });

        const renderClock = () => (
            <Clock
                value={value.value}
                onUpdate:value={(next: TimeValue | undefined) => {
                    value.value = next;
                }}
                minValue={props.minValue}
                maxValue={props.maxValue}
                steps={props.clockSteps}
                gap={props.clockGap}
                hasSeconds={props.hasSeconds}
                isTwelveHour={props.isTwelveHour}
                isDisabled={props.isDisabled}
                locale={props.locale}
                ariaLabel={props.clockLabel}
                computeIsTimeDisabled={props.computeIsTimeDisabled}
            >
                {
                    {
                        renderOption: slots.renderOption,
                        renderUnit: slots.renderUnit,
                        renderColumn: slots.renderColumn,
                    } satisfies Partial<ClockSlots>
                }
            </Clock>
        );

        return () => {
            const isDisabled = getIsDisabled();

            const forwarded = {
                ...forwardProps(props, TimeInput),
                "segmentHints": props.segmentHints,
                "value": value.value,
                "onUpdate:value": (next: TimeValue | undefined) => {
                    value.value = next;
                },
            };

            const renderTrigger = (meridiem: TimeInputMeridiem) => (
                <InteractionWrapper
                    isDisabled={isDisabled}
                    extraFlags={{ isOpen: isOpen.value } satisfies PopupTriggerFlags}
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <PopupTrigger
                                    ref={setElementRef}
                                    id={props.triggerId}
                                    popupId={popupId}
                                    isOpen={isOpen.value}
                                    ariaLabel={props.triggerAriaLabel}
                                    flags={flags}
                                    onToggle={() => (isOpen.value ? dismiss() : open())}
                                >
                                    {
                                        {
                                            renderContent: (triggerFlags) =>
                                                callSlot(slots.renderTrigger, { flags: triggerFlags, meridiem }),
                                        } satisfies InteractionControlSlots<PopupTriggerFlags>
                                    }
                                </PopupTrigger>
                            ),
                        } satisfies Partial<InteractionWrapperSlots<PopupTriggerFlags>>
                    }
                </InteractionWrapper>
            );

            return (
                <div ref={rootRef}>
                    <TimeInput {...forwarded}>
                        {
                            {
                                renderContent: slots.renderContent,
                                renderPlaceholder: slots.renderPlaceholder,
                                renderLeading: slots.renderLeading,
                                renderDecoration: slots.renderDecoration,
                                renderTrailing: ({ flags, meridiem }) => (
                                    <>
                                        {callSlot(slots.renderTrailing, { flags, meridiem })}

                                        {renderTrigger(meridiem)}
                                    </>
                                ),
                            } satisfies Partial<TimeInputSlots>
                        }
                    </TimeInput>

                    <Popover
                        id={popupId}
                        role={"dialog"}
                        ariaAttributes={{ "aria-label": props.clockLabel }}
                        isOpen={isOpen.value}
                        anchorRef={rootRef.value}
                        placement={props.placement ?? TIME_PICKER_DEFAULTS.placement}
                        offset={props.offset}
                        transitionDurationMs={props.popupTransitionDurationMs}
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
                                        renderClock,
                                        visibilityTarget,
                                        transitionDurationMs,
                                    }),
                            } satisfies PopoverSlots
                        }
                    </Popover>
                </div>
            );
        };
    },
    {
        name: "TimePicker",
        slots: Object as SlotsType<TimePickerSlots>,
        props: declareProps<TimePickerProps>({
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
            "computeTextStyle": null,
            "onMouseEnter": null,
            "onMouseLeave": null,
            "id": null,
            "name": null,
            "ariaLabel": null,
            "isReadOnly": Boolean,
            "isRequired": Boolean,
            "autoComplete": null,
            "isConcealed": Boolean,
            "padding": null,
            "gap": null,
            "ariaAttributes": null,
            "minValue": null,
            "maxValue": null,
            "hasSeconds": Boolean,
            "isTwelveHour": Boolean,
            "segmentHints": null,
            "value": null,
            "onUpdate:value": null,
            "placement": null,
            "offset": null,
            "popupTransitionDurationMs": null,
            "clockLabel": null,
            "locale": null,
            "clockSteps": null,
            "clockGap": null,
            "computeIsTimeDisabled": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "triggerId": null,
            "triggerAriaLabel": null,
        }),
    },
);
