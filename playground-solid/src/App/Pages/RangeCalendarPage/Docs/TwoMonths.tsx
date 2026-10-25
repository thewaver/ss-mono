import { createSignal } from "solid-js";

import type { DateValueRange } from "@thewaver/ss-components-solid";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal<DateValueRange | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"twoMonths"} locale={LOCALE} />

            <RangeCalendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                monthCount={MONTH_COUNT}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderMonthHeader={(getMonth) => (
                    <PageCalendarTitle flags={{}}>
                        {DateValueUtils.format(getMonth(), MONTH_HEADER_OPTIONS, LOCALE)}
                    </PageCalendarTitle>
                )}
            />
        </PageCalendarFrame>
    );
};
