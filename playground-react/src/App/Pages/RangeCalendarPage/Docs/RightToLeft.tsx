import { useState } from "react";

import type { DateValueRange } from "@thewaver/ss-components-react";
import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { CHOOSE_DATE_RANGE_RIGHT_LABEL } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";

export const RightToLeftDocsExample = () => {
    const valueState = useState<DateValueRange | undefined>();
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <div dir={"rtl"}>
            <PageCalendarFrame>
                <PageCalendarCaption month={monthState} itemKey={"rightToLeft"} locale={LOCALE} />

                <RangeCalendar
                    value={valueState}
                    month={monthState}
                    today={TODAY}
                    locale={LOCALE}
                    ariaLabel={CHOOSE_DATE_RANGE_RIGHT_LABEL}
                    renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>
        </div>
    );
};
