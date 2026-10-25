import type { Signal } from "solid-js";
import { createSignal } from "solid-js";

import type { DateValue, DateValueRange } from "@thewaver/ss-components-solid";
import { DateValueUtils, RangeCalendar, access } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarCalendarsDocsExampleProps } from "../RangeCalendarPageSolid.types";

type Props = RangeCalendarCalendarsDocsExampleProps;

export const CalendarsDocsExample = (props: Props) => {
    const valueSignal = createSignal<DateValueRange | undefined>();
    const [getMonth, setMonth] = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    const monthSignal: Signal<DateValue> = [
        () => DateValueUtils.withCalendar(getMonth(), access(props.calendar)),
        setMonth,
    ];

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"calendars"} locale={LOCALE} />

            <RangeCalendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
