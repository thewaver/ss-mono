import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-solid";
import {
    CHOOSE_WORKING_DAY_LABEL,
    LOCALE,
    TODAY,
    WEEKEND_DAYS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const DisabledDaysDocsExample = () => {
    const valueSignal = createSignal<DateValue | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthSignal} key={"disabledDays"} locale={LOCALE} />

            <Calendar
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                disabledDays={[{ daysOfWeek: WEEKEND_DAYS }]}
                ariaLabel={CHOOSE_WORKING_DAY_LABEL}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
