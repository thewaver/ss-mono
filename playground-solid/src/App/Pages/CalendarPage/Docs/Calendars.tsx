import type { Signal } from "solid-js";
import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Calendar, DateValueUtils, access } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarCalendarsDocsExampleProps } from "../CalendarPageSolid.types";

type Props = CalendarCalendarsDocsExampleProps;

export const CalendarsDocsExample = (props: Props) => {
    const valueSignal = createSignal<DateValue | undefined>(TODAY);
    const [getMonth, setMonth] = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    const monthSignal: Signal<DateValue> = [
        () => DateValueUtils.withCalendar(getMonth(), access(props.calendar)),
        setMonth,
    ];

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"calendars"} locale={LOCALE} />

            <Calendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
