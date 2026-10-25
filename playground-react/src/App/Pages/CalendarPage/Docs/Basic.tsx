import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarBasicDocsExampleProps } from "../CalendarPageReact.types";

type Props = CalendarBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const valueState = useState<DateValue | undefined>(TODAY);
    const monthState = useState(DateValueUtils.getStartOfMonth(TODAY));

    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={monthState} itemKey={"basic"} locale={LOCALE} />

            <Calendar
                value={valueState}
                month={monthState}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                isDisabled={props.isDisabled}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
