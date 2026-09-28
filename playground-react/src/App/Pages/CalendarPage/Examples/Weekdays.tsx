import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, TODAY, WEEKEND_DAYS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarExampleProps } from "../CalendarPage.types";

type Props = CalendarExampleProps;

export const WeekdaysExample = (props: Props) => {
    return (
        <PageCalendarFrame>
            <PageCalendarCaption monthState={props.monthState} itemKey={"weekdays"} locale={LOCALE} />

            <Calendar
                valueState={props.valueState}
                monthState={props.monthState}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                ariaLabel={"Choose a working day"}
                computeIsDayDisabled={(day) => WEEKEND_DAYS.includes(DateValueUtils.toDate(day).getDay())}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
