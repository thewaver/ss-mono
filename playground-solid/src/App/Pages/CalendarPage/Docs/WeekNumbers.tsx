import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarWeekNumbersDocsExampleProps } from "../CalendarPageSolid.types";

type Props = CalendarWeekNumbersDocsExampleProps;

export const WeekNumbersDocsExample = (props: Props) => {
    const valueSignal = createSignal<DateValue | undefined>(TODAY);
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"weekNumbers"} locale={LOCALE} />

            <Calendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                minDaysInFirstWeek={props.minDaysInFirstWeek}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderWeekNumber={(weekNumber) => <PageCalendarWeekday>{weekNumber}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
