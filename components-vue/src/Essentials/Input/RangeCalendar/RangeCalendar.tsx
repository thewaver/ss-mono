import { type SlotsType, defineComponent, shallowRef } from "vue";

import { type DateValue, RangeCalendarUtils } from "@thewaver/ss-components";

import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { CalendarComposite } from "../Calendar/Calendar";
import type { CalendarSlots, RangeCalendarProps } from "../Calendar/Calendar.types";

export const RangeCalendar = defineComponent(
    (props: RangeCalendarProps, { slots }: SlotsContext<CalendarSlots>) => {
        const range = useTwoWay(props, "value");
        const month = useTwoWay(props, "month");

        const pendingStart = shallowRef<DateValue>();
        const lastPicked = shallowRef<DateValue>();

        const pick = (day: DateValue) => {
            const next = RangeCalendarUtils.computePick(day, pendingStart.value);

            lastPicked.value = day;
            pendingStart.value = next.pendingStart;
            range.value = next.range;
        };

        return () => (
            <CalendarComposite
                {...{
                    ...forwardProps(props, CalendarComposite),
                    "month": month.value,
                    "onUpdate:month": (next: DateValue) => {
                        month.value = next;
                    },
                }}
                computeIsSelected={(day: DateValue) =>
                    RangeCalendarUtils.getIsSelected(day, pendingStart.value, range.value)
                }
                anchorDay={RangeCalendarUtils.computeAnchorDay(pendingStart.value, lastPicked.value, range.value)}
                computeRange={(highlighted: DateValue) =>
                    RangeCalendarUtils.computePaintedRange(highlighted, pendingStart.value, range.value)
                }
                onPick={pick}
            >
                {
                    {
                        renderDay: slots.renderDay,
                        renderWeekday: slots.renderWeekday,
                    } satisfies Partial<CalendarSlots>
                }
            </CalendarComposite>
        );
    },
    {
        name: "RangeCalendar",
        slots: Object as SlotsType<CalendarSlots>,
        props: declareProps<RangeCalendarProps>({
            "ariaLabel": null,
            "locale": null,
            "weekStartsOn": null,
            "weekdayWidth": null,
            "today": null,
            "minValue": null,
            "maxValue": null,
            "isDisabled": Boolean,
            "gap": null,
            "computeIsDayDisabled": null,
            "month": null,
            "onUpdate:month": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);
