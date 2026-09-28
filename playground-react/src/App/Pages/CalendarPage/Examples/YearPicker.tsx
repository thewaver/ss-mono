import { Calendar, DateValueUtils } from "@thewaver/ss-components-react";
import { LOCALE, MAX_YEAR, MIN_YEAR, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };

type Props = CalendarPrecisionExampleProps;

export const YearPickerExample = (props: Props) => (
    <PageCalendarFrame>
        <PageCalendarPagedCaption
            itemKey={"yearPicker"}
            locale={LOCALE}
            precision={"year"}
            previousLabel={"Previous twelve years"}
            nextLabel={"Next twelve years"}
            monthState={props.monthState}
        />

        <Calendar
            precision={"year"}
            valueState={props.valueState}
            monthState={props.monthState}
            today={TODAY}
            minValue={MIN_YEAR}
            maxValue={MAX_YEAR}
            locale={LOCALE}
            ariaLabel={"Choose a year"}
            renderDay={(day, renderProps) => (
                <PageCalendarCell renderProps={renderProps}>
                    {DateValueUtils.format(day, CELL_OPTIONS, LOCALE)}
                </PageCalendarCell>
            )}
        />
    </PageCalendarFrame>
);
