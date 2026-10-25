import { createSignal } from "solid-js";

import type { DateValueRange } from "@thewaver/ss-components-solid";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-solid";
import { LOCALE, MAX_DATE, MIN_DATE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const BoundedDocsExample = () => {
    const valueSignal = createSignal<DateValueRange | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"bounded"} locale={LOCALE} />

            <RangeCalendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                minValue={MIN_DATE}
                maxValue={MAX_DATE}
                ariaLabel={"Choose a date range within the bounds"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
