import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

export const MonthPickerDocsExample = () => {
    const valueState = useState<DateValue | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarPagedCaption
                itemKey={"monthPicker"}
                locale={LOCALE}
                precision={"month"}
                previousLabel={"Previous year"}
                nextLabel={"Next year"}
                month={monthState}
            />

            <Calendar
                precision={"month"}
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                ariaLabel={"Choose a month"}
                renderDay={(day, renderProps) => (
                    <PageCalendarCell renderProps={renderProps}>
                        {DateValueUtils.format(day, CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                )}
            />
        </PageCalendarFrame>
    );
};
