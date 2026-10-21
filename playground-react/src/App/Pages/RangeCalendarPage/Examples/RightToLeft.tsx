import { RangeCalendar } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { RangeCalendarExampleProps } from "../RangeCalendarPage.types";

type Props = RangeCalendarExampleProps;

export const RightToLeftExample = (props: Props) => {
    return (
        <div dir={"rtl"}>
            <PageCalendarFrame>
                <PageCalendarCaption month={props.month} itemKey={"rightToLeft"} locale={LOCALE} />

                <RangeCalendar
                    value={props.value}
                    month={props.month}
                    today={TODAY}
                    locale={LOCALE}
                    weekStartsOn={props.weekStartsOn}
                    ariaLabel={"Choose a date range in a right-to-left box"}
                    renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                    renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                />
            </PageCalendarFrame>
        </div>
    );
};
