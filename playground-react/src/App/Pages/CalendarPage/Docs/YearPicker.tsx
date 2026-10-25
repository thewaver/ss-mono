import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, MAX_YEAR, MIN_YEAR, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };

export const YearPickerDocsExample = () => {
    const valueState = useState<DateValue | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarPagedCaption
                itemKey={"yearPicker"}
                locale={LOCALE}
                precision={"year"}
                previousLabel={"Previous twelve years"}
                nextLabel={"Next twelve years"}
                month={monthState}
            />

            <Calendar
                precision={"year"}
                value={valueState}
                month={monthState}
                today={TODAY}
                minValue={MIN_YEAR}
                maxValue={MAX_YEAR}
                locale={LOCALE}
                ariaLabel={"Choose a year"}
                renderDay={(day, renderProps) => (
                    <PageCalendarCell renderProps={renderProps}>
                        {DateValueUtils.format(day, CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                )}
            />
        </PageCalendarFrame>
    );
};
