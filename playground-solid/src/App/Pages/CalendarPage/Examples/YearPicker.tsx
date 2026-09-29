import { Calendar, DateValueUtils } from "@thewaver/ss-components-solid";
import { LOCALE, MAX_YEAR, MIN_YEAR, TODAY } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";
import type { CalendarPrecisionExampleProps } from "../CalendarPage.types";

const CELL_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };

type Props = CalendarPrecisionExampleProps;

export const YearPickerExample = (props: Props) => (
    <PageCalendarFrame>
        <PageCalendarPagedCaption
            key={"yearPicker"}
            locale={LOCALE}
            precision={"year"}
            previousLabel={"Previous twelve years"}
            nextLabel={"Next twelve years"}
            month={props.month}
        />

        <Calendar
            precision={"year"}
            value={props.value}
            month={props.month}
            today={TODAY}
            minValue={MIN_YEAR}
            maxValue={MAX_YEAR}
            locale={LOCALE}
            ariaLabel={"Choose a year"}
            renderDay={(getDay, getRenderProps) => (
                <PageCalendarCell renderProps={getRenderProps}>
                    {DateValueUtils.format(getDay(), CELL_OPTIONS, LOCALE)}
                </PageCalendarCell>
            )}
        />
    </PageCalendarFrame>
);
