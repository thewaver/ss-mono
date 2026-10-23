import { DateValueUtils, RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import { MONTH_HEADER_OPTIONS } from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarTitle,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarExampleProps } from "../RangeCalendarPage.types";

const MONTH_COUNT = 2;

type Props = RangeCalendarExampleProps;

export const TwoMonthsExample = (props: Props) => {
    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={props.month} itemKey={"twoMonths"} locale={LOCALE} />

            <RangeCalendar
                value={props.value}
                month={props.month}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                monthCount={MONTH_COUNT}
                ariaLabel={"Choose a date range"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderMonthHeader={(month) => (
                    <PageCalendarTitle flags={{}}>
                        {DateValueUtils.format(month, MONTH_HEADER_OPTIONS, LOCALE)}
                    </PageCalendarTitle>
                )}
            />
        </PageCalendarFrame>
    );
};
