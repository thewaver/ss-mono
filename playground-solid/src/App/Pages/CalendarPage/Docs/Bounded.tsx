import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-solid";
import {
    CHOOSE_DATE_WITHIN_AUGUST_LABEL,
    LOCALE,
    MAX_DATE,
    MIN_DATE,
    TODAY,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const BoundedDocsExample = () => {
    const valueSignal = createSignal<DateValue | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"bounded"} locale={LOCALE} />

            <Calendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                minValue={MIN_DATE}
                maxValue={MAX_DATE}
                ariaLabel={CHOOSE_DATE_WITHIN_AUGUST_LABEL}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
