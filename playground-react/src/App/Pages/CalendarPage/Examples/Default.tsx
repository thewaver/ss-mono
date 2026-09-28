import { Calendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarExampleProps } from "../CalendarPage.types";

type Props = CalendarExampleProps;

export const DefaultExample = (props: Props) => {
    return (
        <PageCalendarFrame>
            <PageCalendarCaption monthState={props.monthState} itemKey={"default"} locale={LOCALE} />

            <Calendar
                valueState={props.valueState}
                monthState={props.monthState}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
