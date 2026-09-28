import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

type Props = CalendarPrecisionExampleProps;

export const MonthPickerExample = (props: Props) => (
    <PageCalendarFrame>
        <PageCalendarPagedCaption
            itemKey={"monthPicker"}
            locale={LOCALE}
            precision={"month"}
            previousLabel={"Previous year"}
            nextLabel={"Next year"}
            monthState={props.monthState}
        />

        <Calendar
            precision={"month"}
            valueState={props.valueState}
            monthState={props.monthState}
            today={TODAY}
            locale={LOCALE}
            ariaLabel={"Choose a month"}
            renderDay={(day, renderProps) => (
                <PageCalendarCell renderProps={renderProps}>
                    {DateValueUtils.format(day, CELL_OPTIONS, LOCALE)}
                </PageCalendarCell>
            )}
        />
    </PageCalendarFrame>
);
