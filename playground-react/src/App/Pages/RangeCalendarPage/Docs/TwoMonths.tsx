import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { Button, DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarHeader,
    PageCalendarTitle,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

const MONTH_COUNT = 2;
const MONTH_STEP = 1;

export const TwoMonthsDocsExample = () => {
    const valueState = useState<DateValueRange | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    const page = (direction: 1 | -1) => {
        monthState[1]((prev) => DateValueUtils.addMonths(prev, direction * MONTH_STEP));
    };

    return (
        <PageCalendarFrame>
            <RangeCalendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                monthCount={MONTH_COUNT}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderMonthHeader={(month, index) => (
                    <PageCalendarHeader>
                        {index === 0 && (
                            <Button
                                id={"twoMonthsPreviousMonth"}
                                ariaLabel={"Previous month"}
                                renderContent={(flags) => <PageButtonContent flags={flags}>◀</PageButtonContent>}
                                onClick={() => page(-1)}
                            />
                        )}

                        <PageCalendarTitle flags={{}}>
                            {DateValueUtils.format(month, MONTH_HEADER_OPTIONS, LOCALE)}
                        </PageCalendarTitle>

                        {index === MONTH_COUNT - 1 && (
                            <Button
                                id={"twoMonthsNextMonth"}
                                ariaLabel={"Next month"}
                                renderContent={(flags) => <PageButtonContent flags={flags}>▶</PageButtonContent>}
                                onClick={() => page(1)}
                            />
                        )}
                    </PageCalendarHeader>
                )}
            />
        </PageCalendarFrame>
    );
};
