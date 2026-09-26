import { Calendar, DateValueUtils } from "@thewaver/ss-components";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";
import { LOCALE, TODAY } from "../CalendarPage.const";
import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

type Props = CalendarPrecisionExampleProps;

export const MonthPickerExample = (props: Props) => (
    <PageCalendarFrame>
        <PageCalendarPagedCaption
            key={"monthPicker"}
            locale={LOCALE}
            precision={"month"}
            previousLabel={"Previous year"}
            nextLabel={"Next year"}
            monthSignal={props.monthSignal}
        />

        <Calendar
            precision={"month"}
            valueSignal={props.valueSignal}
            monthSignal={props.monthSignal}
            today={TODAY}
            locale={LOCALE}
            ariaLabel={"Choose a month"}
            renderDay={(getDay, getRenderProps) => (
                <PageCalendarCell renderProps={getRenderProps}>
                    {DateValueUtils.format(getDay(), CELL_OPTIONS, LOCALE)}
                </PageCalendarCell>
            )}
        />
    </PageCalendarFrame>
);
