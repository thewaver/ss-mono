import { type SlotsType, defineComponent, nextTick, shallowRef, useId } from "vue";

import { DATE_PICKER_DEFAULTS, type DateValue, DateValueUtils, type PopupTriggerFlags } from "@thewaver/ss-components";

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
import { Calendar } from "../Calendar/Calendar";
import type { CalendarSlots } from "../Calendar/Calendar.types";
import { DateInput } from "../DateInput/DateInput";
import type { DateInputSlots } from "../DateInput/DateInput.types";
import type { DatePickerProps, DatePickerSlots } from "./DatePicker.types";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DatePicker = defineComponent(
    (props: DatePickerProps, { slots }: SlotsContext<DatePickerSlots>) => {
        const value = useTwoWay(props, "value");
        const isOpen = useTwoWay(props, "visibility", false);

        const popupId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const month = shallowRef(toMonth(value.value ?? DateValueUtils.fromDate(new Date())));

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
            if (isShown && value.value) month.value = toMonth(value.value);
        });

        watchAfterRender([isOpen], ([isShown]) => {
            if (isShown || !isFocusReturned) return;

            isFocusReturned = false;

            void nextTick(() => rootRef.value?.querySelector("input")?.focus());
        });

        const renderCalendar = () => (
            <Calendar
                value={value.value}
                onUpdate:value={(next: DateValue | undefined) => {
                    value.value = next;
                }}
                month={month.value}
                onUpdate:month={(next: DateValue) => {
                    month.value = next;
                }}
                minValue={props.minValue}
                maxValue={props.maxValue}
                isDisabled={props.isDisabled}
                locale={props.locale}
                weekStartsOn={props.weekStartsOn}
                precision={props.precision}
                ariaLabel={props.calendarLabel}
                computeIsDayDisabled={props.computeIsDayDisabled}
            >
                {
                    {
                        renderDay: slots.renderDay,
                        renderWeekday: slots.renderWeekday,
                    } satisfies Partial<CalendarSlots>
                }
            </Calendar>
        );

        return () => {
            const isDisabled = getIsDisabled();

            const forwarded = {
                ...forwardProps(props, DateInput),
                "partHints": props.partHints,
                "value": value.value,
                "onUpdate:value": (next: DateValue | undefined) => {
                    value.value = next;
                },
            };

            const renderTrigger = () => (
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
                                            renderContent: slots.renderTrigger,
                                        } satisfies Partial<InteractionControlSlots<PopupTriggerFlags>>
                                    }
                                </PopupTrigger>
                            ),
                        } satisfies Partial<InteractionWrapperSlots<PopupTriggerFlags>>
                    }
                </InteractionWrapper>
            );

            return (
                <div ref={rootRef}>
                    <DateInput {...forwarded}>
                        {
                            {
                                renderContent: slots.renderContent,
                                renderPlaceholder: slots.renderPlaceholder,
                                renderLeading: slots.renderLeading,
                                renderDecoration: slots.renderDecoration,
                                renderTrailing: renderTrigger,
                            } satisfies Partial<DateInputSlots>
                        }
                    </DateInput>

                    <Popover
                        id={popupId}
                        role={"dialog"}
                        ariaAttributes={{ "aria-label": props.calendarLabel }}
                        isOpen={isOpen.value}
                        anchorRef={rootRef.value}
                        placement={props.placement ?? DATE_PICKER_DEFAULTS.placement}
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
                                        renderCalendar,
                                        month,
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
        name: "DatePicker",
        slots: Object as SlotsType<DatePickerSlots>,
        props: declareProps<DatePickerProps>({
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
            "onKeyDown": null,
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
            "format": null,
            "calendar": null,
            "locale": null,
            "partHints": null,
            "value": null,
            "onUpdate:value": null,
            "placement": null,
            "offset": null,
            "popupTransitionDurationMs": null,
            "calendarLabel": null,
            "weekStartsOn": null,
            "precision": null,
            "computeIsDayDisabled": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "triggerId": null,
            "triggerAriaLabel": null,
        }),
    },
);
