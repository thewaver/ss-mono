import { createSignal } from "solid-js";

import type { DateValueRange } from "@thewaver/ss-components-solid";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-solid";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { CHOOSE_DATE_RANGE_RIGHT_LABEL } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const RightToLeftDocsExample = () => {
    const valueSignal = createSignal<DateValueRange | undefined>();
    const monthSignal = createSignal(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <div dir={"rtl"}>
            <PageCalendarFrame>
                <PageCalendarCaption month={monthSignal} key={"rightToLeft"} locale={LOCALE} />

                <RangeCalendar
                    value={valueSignal}
                    month={monthSignal}
                    today={TODAY}
                    locale={LOCALE}
                    ariaLabel={CHOOSE_DATE_RANGE_RIGHT_LABEL}
                    renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>
        </div>
    );
};
