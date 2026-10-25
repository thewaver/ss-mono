import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

export const MonthPickerDocsExample = () => {
    const valueSignal = createSignal<DateValue | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarPagedCaption
                key={"monthPicker"}
                locale={LOCALE}
                precision={"month"}
                previousLabel={"Previous year"}
                nextLabel={"Next year"}
                month={monthSignal}
            />

            <Calendar
                precision={"month"}
                value={valueSignal}
                month={monthSignal}
                today={TODAY}
                locale={LOCALE}
                ariaLabel={"Choose a month"}
                renderDay={(getDay, getRenderProps) => (
                    <PageCalendarCell renderProps={getRenderProps}>
                        {DateValueUtils.format(getDay(), CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                )}
            />
        </PageCalendarFrame>
    );
};
