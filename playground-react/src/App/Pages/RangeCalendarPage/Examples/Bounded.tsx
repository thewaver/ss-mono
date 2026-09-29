import { RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, MAX_DATE, MIN_DATE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarExampleProps } from "../RangeCalendarPage.types";

type Props = RangeCalendarExampleProps;

export const BoundedExample = (props: Props) => {
    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={props.month} itemKey={"bounded"} locale={LOCALE} />

            <RangeCalendar
                value={props.value}
                month={props.month}
                today={TODAY}
                locale={LOCALE}
                minValue={MIN_DATE}
                maxValue={MAX_DATE}
                weekStartsOn={props.weekStartsOn}
                ariaLabel={"Choose a date range within the bounds"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
