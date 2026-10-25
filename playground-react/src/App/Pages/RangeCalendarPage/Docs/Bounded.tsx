import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, MAX_DATE, MIN_DATE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const BoundedDocsExample = () => {
    const valueState = useState<DateValueRange | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"bounded"} locale={LOCALE} />

            <RangeCalendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                minValue={MIN_DATE}
                maxValue={MAX_DATE}
                ariaLabel={"Choose a date range within the bounds"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
