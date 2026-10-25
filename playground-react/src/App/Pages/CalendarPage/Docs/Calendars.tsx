import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarCalendarsDocsExampleProps } from "../CalendarPageReact.types";

type Props = CalendarCalendarsDocsExampleProps;

export const CalendarsDocsExample = (props: Props) => {
    const valueState = useState<DateValue | undefined>(TODAY);
    const [month, setMonth] = useState(DateValueUtils.getStartOfMonth(TODAY));

    const monthState = [DateValueUtils.withCalendar(month, props.calendar), setMonth] as const;

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"calendars"} locale={LOCALE} />

            <Calendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
