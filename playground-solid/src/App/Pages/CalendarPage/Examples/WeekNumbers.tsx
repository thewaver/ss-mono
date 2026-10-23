import { Calendar } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarWeekNumbersExampleProps } from "../CalendarPage.types";

type Props = CalendarWeekNumbersExampleProps;

export const WeekNumbersExample = (props: Props) => {
    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={props.month} key={"weekNumbers"} locale={LOCALE} />

            <Calendar
                value={props.value}
                month={props.month}
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
