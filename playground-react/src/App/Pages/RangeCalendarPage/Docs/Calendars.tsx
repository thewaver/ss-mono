import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarCalendarsDocsExampleProps } from "../RangeCalendarPageReact.types";

type Props = RangeCalendarCalendarsDocsExampleProps;

export const CalendarsDocsExample = (props: Props) => {
    const valueState = useState<DateValueRange | undefined>();
    const [month, setMonth] = useState(DateValueUtils.getStartOfMonth(TODAY));

    const monthState = [DateValueUtils.withCalendar(month, props.calendar), setMonth] as const;

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"calendars"} locale={LOCALE} />

            <RangeCalendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
