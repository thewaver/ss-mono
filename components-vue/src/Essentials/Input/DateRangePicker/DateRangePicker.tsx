import { type SlotsType, defineComponent, nextTick, shallowRef, useId } from "vue";

import {
    DATE_RANGE_PICKER_DEFAULTS,
    DateRangePickerStyles,
    DateRangePickerUtils,
    type DateValue,
    type DateValueRange,
    DateValueUtils,
    type PopupTriggerFlags,
} from "@thewaver/ss-components";

import { SignalMirrorVueUtils } from "../../../Abstracts/SignalMirror/SignalMirrorVue.utils";
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
import type { CalendarSlots } from "../Calendar/Calendar.types";
import { DateInput } from "../DateInput/DateInput";
import type { DateInputSlots } from "../DateInput/DateInput.types";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import type { DateRangePickerProps, DateRangePickerSlots } from "./DateRangePicker.types";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DateRangePicker = defineComponent(
    (props: DateRangePickerProps, { slots }: SlotsContext<DateRangePickerSlots>) => {
        const range = useTwoWay(props, "value");
        const isOpen = useTwoWay(props, "visibility", false);

        const popupId = useId();
        const fallbackFieldId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const month = shallowRef(toMonth(range.value?.start ?? DateValueUtils.fromDate(new Date())));

        let isFocusReturned = false;

        const { first: start, second: end } = SignalMirrorVueUtils.useSplit<DateValueRange, DateValue, DateValue>(
            range,
            DateRangePickerUtils.SPLIT_DEFS,
        );

        const getIsDisabled = () => props.isDisabled ?? false;
        const getEndFieldId = () => `${props.id ?? fallbackFieldId}-end`;

        const open = () => {
            if (getIsDisabled()) return;

            isOpen.value = true;
        };

        const dismiss = () => {
            if (!isOpen.value) return;

            isFocusReturned = true;
            isOpen.value = false;
        };

        watchAfterRender([isOpen, getIsDisabled], ([isShown, isDisabled]) => {
            if (isShown && isDisabled) isOpen.value = false;
        });

        watchAfterRender([isOpen], ([isShown]) => {
            if (isShown && range.value?.start) month.value = toMonth(range.value.start);
        });

        watchAfterRender([isOpen], ([isShown]) => {
            if (isShown || !isFocusReturned) return;

            isFocusReturned = false;

            void nextTick(() => {
                rootRef.value?.querySelector<HTMLInputElement>(`#${CSS.escape(getEndFieldId())}`)?.focus();
            });
        });

        const renderCalendar = () => (
            <RangeCalendar
                value={range.value}
                onUpdate:value={(next: DateValueRange | undefined) => {
                    range.value = next;
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
                ariaLabel={props.calendarLabel}
                computeIsDayDisabled={props.computeIsDayDisabled}
            >
                {
                    {
                        renderDay: slots.renderDay,
                        renderWeekday: slots.renderWeekday,
                    } satisfies Partial<CalendarSlots>
                }
            </RangeCalendar>
        );

        return () => {
            const isDisabled = getIsDisabled();

            const fieldSlots = {
                renderContent: slots.renderContent,
                renderPlaceholder: slots.renderPlaceholder,
                renderLeading: slots.renderLeading,
                renderDecoration: slots.renderDecoration,
            } satisfies Partial<DateInputSlots>;

            const startField = {
                ...forwardProps(props, DateInput),
                "partHints": props.partHints,
                "value": start.value,
                "onUpdate:value": (next: DateValue | undefined) => {
                    start.value = next;
                },
                "id": props.id && `${props.id}-start`,
                "name": props.name && `${props.name}-start`,
                "ariaLabel": props.startLabel,
            };

            const endField = {
                ...forwardProps(props, DateInput),
                "partHints": props.partHints,
                "value": end.value,
                "onUpdate:value": (next: DateValue | undefined) => {
                    end.value = next;
                },
                "id": getEndFieldId(),
                "name": props.name && `${props.name}-end`,
                "ariaLabel": props.endLabel,
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
                <div ref={rootRef} class={DateRangePickerStyles.dateRangePickerRoot}>
                    <DateInput {...startField}>{fieldSlots}</DateInput>

                    {callSlot(slots.renderSeparator, undefined)}

                    <DateInput {...endField}>
                        {
                            {
                                ...fieldSlots,
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
                        placement={props.placement ?? DATE_RANGE_PICKER_DEFAULTS.placement}
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
        name: "DateRangePicker",
        slots: Object as SlotsType<DateRangePickerSlots>,
        props: declareProps<DateRangePickerProps>({
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
            "placement": null,
            "offset": null,
            "popupTransitionDurationMs": null,
            "calendarLabel": null,
            "startLabel": null,
            "endLabel": null,
            "weekStartsOn": null,
            "computeIsDayDisabled": null,
            "value": null,
            "onUpdate:value": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "triggerId": null,
            "triggerAriaLabel": null,
        }),
    },
);
