import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarTitle,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

const MONTH_COUNT = 2;

export const TwoMonthsDocsExample = () => {
    const valueState = useState<DateValueRange | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"twoMonths"} locale={LOCALE} />

            <RangeCalendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                monthCount={MONTH_COUNT}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderMonthHeader={(month) => (
                    <PageCalendarTitle flags={{}}>
                        {DateValueUtils.format(month, MONTH_HEADER_OPTIONS, LOCALE)}
                    </PageCalendarTitle>
                )}
            />
        </PageCalendarFrame>
    );
};
