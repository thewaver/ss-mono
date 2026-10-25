import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import {
    DateTimePickerStyles,
    DateTimePickerUtils,
    type DateValue,
    type InteractionFlags,
    InteractionTrackerUtils,
    type TextFieldFlags,
    TextFieldUtils,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { DateTimeValueVueUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueVue.utils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { Tooltip } from "../../Overlays/Tooltip/Tooltip";
import type { TooltipSlots } from "../../Overlays/Tooltip/Tooltip.types";
import { DatePicker } from "../DatePicker/DatePicker";
import type { DatePickerSlots } from "../DatePicker/DatePicker.types";
import { TimePicker } from "../TimePicker/TimePicker";
import type { TimePickerSlots } from "../TimePicker/TimePicker.types";
import type { DateTimePickerProps, DateTimePickerSlots } from "./DateTimePicker.types";

export const DateTimePicker = defineComponent(
    (props: DateTimePickerProps, { slots }: SlotsContext<DateTimePickerSlots>) => {
        const value = useTwoWay(props, "value");
        const dateVisibility = useTwoWay(props, "dateVisibility", false);
        const timeVisibility = useTwoWay(props, "timeVisibility", false);

        const { date, time } = DateTimeValueVueUtils.useSplit(value);

        const rootRef = shallowRef<HTMLDivElement>();

        const dateFlags = shallowRef<InteractionFlags<TextFieldFlags>>();
        const timeFlags = shallowRef<InteractionFlags<TextFieldFlags>>();

        const getPairFlags = () =>
            TextFieldUtils.mergeFlags([dateFlags.value, timeFlags.value].flatMap((flags) => (flags ? [flags] : [])));

        const tooltipDefs = computed(() => {
            const defs = props.tooltipDefs;
            const isDisabled = props.isDisabled ?? false;
            const isReachable = InteractionTrackerUtils.computeIsReachable(
                isDisabled,
                props.isReachableWhenDisabled ?? false,
            );

            return defs && (!isDisabled || isReachable) ? defs : undefined;
        });

        const lastTooltipDefs = computed<typeof tooltipDefs.value>((previous) => tooltipDefs.value ?? previous);

        const renderFieldContent = (flagsRef: typeof dateFlags) => (flags: InteractionFlags<TextFieldFlags>) => {
            flagsRef.value = flags;

            return callSlot(slots.renderContent, flags);
        };

        return () => {
            const dateHalf = {
                ...forwardProps(props, DatePicker),
                "partHints": props.partHints,
                "calendarLabel": props.calendarLabel,
                "triggerAriaLabel": props.triggerAriaLabel,
                "value": date.value,
                "onUpdate:value": (next: DateValue | undefined) => {
                    date.value = next;
                },
                "id": props.id && `${props.id}-date`,
                "name": props.name && `${props.name}-date`,
                "visibility": dateVisibility.value,
                "onUpdate:visibility": (isOpen: boolean) => {
                    dateVisibility.value = isOpen;
                },
                "ariaLabel": props.dateLabel,
                "minValue": props.minValue?.date,
                "maxValue": props.maxValue?.date,
                "tooltipDefs": undefined,
            };

            const timeHalf = {
                ...forwardProps(props, TimePicker),
                "segmentHints": props.segmentHints,
                "clockLabel": props.clockLabel,
                "value": time.value,
                "onUpdate:value": (next: TimeValue | undefined) => {
                    time.value = next;
                },
                "id": props.id && `${props.id}-time`,
                "name": props.name && `${props.name}-time`,
                "visibility": timeVisibility.value,
                "onUpdate:visibility": (isOpen: boolean) => {
                    timeVisibility.value = isOpen;
                },
                "ariaLabel": props.timeLabel,
                "minValue": props.minValue && DateTimePickerUtils.computeMinTime(date.value, props.minValue),
                "maxValue": props.maxValue && DateTimePickerUtils.computeMaxTime(date.value, props.maxValue),
                "triggerId": props.timeTriggerId,
                "triggerAriaLabel": props.timeTriggerAriaLabel,
                "tooltipDefs": undefined,
            };

            return (
                <div ref={rootRef} class={DateTimePickerStyles.dateTimePickerRoot}>
                    <DatePicker {...dateHalf}>
                        {
                            {
                                renderContent: renderFieldContent(dateFlags),
                                renderPlaceholder: slots.renderPlaceholder,
                                renderLeading: slots.renderLeading,
                                renderDecoration: slots.renderDecoration,
                                renderTrigger: slots.renderTrigger,
                                renderDay: slots.renderDay,
                                renderWeekday: slots.renderWeekday,
                                renderPopup: slots.renderPopup,
                            } satisfies Partial<DatePickerSlots>
                        }
                    </DatePicker>

                    {callSlot(slots.renderSeparator, undefined)}

                    <TimePicker {...timeHalf}>
                        {
                            {
                                renderContent: renderFieldContent(timeFlags),
                                renderPlaceholder: slots.renderPlaceholder,
                                renderDecoration: slots.renderDecoration,
                                renderTrailing: slots.renderTimeTrailing,
                                renderTrigger: slots.renderTimeTrigger,
                                renderOption: slots.renderOption,
                                renderUnit: slots.renderUnit,
                                renderColumn: slots.renderColumn,
                                renderPopup: slots.renderTimePopup,
                            } satisfies Partial<TimePickerSlots>
                        }
                    </TimePicker>

                    {lastTooltipDefs.value &&
                        (() => {
                            const { renderContent, ...tooltipProps } = lastTooltipDefs.value;

                            return (
                                <Tooltip
                                    {...tooltipProps}
                                    isAnchorGroup={true}
                                    anchorRef={tooltipDefs.value ? rootRef.value : undefined}
                                >
                                    {
                                        {
                                            renderContent: (content) =>
                                                renderContent({ ...content, flags: getPairFlags() }),
                                        } satisfies TooltipSlots
                                    }
                                </Tooltip>
                            );
                        })()}
                </div>
            );
        };
    },
    {
        name: "DateTimePicker",
        slots: Object as SlotsType<DateTimePickerSlots>,
        props: declareProps<DateTimePickerProps>({
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
            "isLeftToRight": Boolean,
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
            "weekStartsOn": null,
            "disabledDays": null,
            "computeIsDayDisabled": null,
            "triggerId": null,
            "triggerAriaLabel": null,
            "dateLabel": null,
            "timeLabel": null,
            "clockLabel": null,
            "hasSeconds": Boolean,
            "isTwelveHour": Boolean,
            "segmentHints": null,
            "clockSteps": null,
            "clockGap": null,
            "computeIsTimeDisabled": null,
            "value": null,
            "onUpdate:value": null,
            "dateVisibility": Boolean,
            "onUpdate:dateVisibility": null,
            "timeVisibility": Boolean,
            "onUpdate:timeVisibility": null,
            "timeTriggerId": null,
            "timeTriggerAriaLabel": null,
        }),
    },
);
