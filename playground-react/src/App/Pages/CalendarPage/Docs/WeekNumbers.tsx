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
import type { CalendarWeekNumbersDocsExampleProps } from "../CalendarPageReact.types";

type Props = CalendarWeekNumbersDocsExampleProps;

export const WeekNumbersDocsExample = (props: Props) => {
    const valueState = useState<DateValue | undefined>(TODAY);
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"weekNumbers"} locale={LOCALE} />

            <Calendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                minDaysInFirstWeek={props.minDaysInFirstWeek}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderWeekNumber={(weekNumber) => <PageCalendarWeekday>{weekNumber}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
