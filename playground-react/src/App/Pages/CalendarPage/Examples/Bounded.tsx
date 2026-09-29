import { Calendar } from "@thewaver/ss-components-react";
import { LOCALE, MAX_DATE, MIN_DATE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarExampleProps } from "../CalendarPage.types";

type Props = CalendarExampleProps;

export const BoundedExample = (props: Props) => {
    return (
        <PageCalendarFrame>
            <PageCalendarCaption month={props.month} itemKey={"bounded"} locale={LOCALE} />

            <Calendar
                value={props.value}
                month={props.month}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                minValue={MIN_DATE}
                maxValue={MAX_DATE}
                ariaLabel={"Choose a date within August"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
