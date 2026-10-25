import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<DateValue | undefined>(TODAY);
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <div dir={"rtl"}>
            <PageCalendarFrame>
                <PageCalendarCaption month={monthSignal} key={"rightToLeft"} locale={LOCALE} />

                <Calendar
                    value={valueSignal}
                    month={monthSignal}
                    today={TODAY}
                    locale={LOCALE}
                    ariaLabel={"Choose a date in a right-to-left box"}
                    renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>
        </div>
    );
};
