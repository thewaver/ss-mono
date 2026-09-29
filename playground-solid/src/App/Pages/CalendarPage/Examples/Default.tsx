import { Calendar } from "@thewaver/ss-components-solid";
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
            <PageCalendarCaption month={props.month} key={"default"} locale={() => LOCALE} />

            <Calendar
                value={props.value}
                month={props.month}
                today={() => TODAY}
                locale={() => LOCALE}
                weekStartsOn={props.weekStartsOn}
                ariaLabel={"Choose a date"}
                renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            />
        </PageCalendarFrame>
    );
};
