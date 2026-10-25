import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, TODAY, WEEKEND_DAYS } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const DisabledDaysDocsExample = () => {
    const valueState = useState<DateValue | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"disabledDays"} locale={LOCALE} />

            <Calendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                disabledDays={[{ daysOfWeek: WEEKEND_DAYS }]}
                ariaLabel={"Choose a working day"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
