import { Calendar, DateValueUtils } from "@thewaver/ss-components";

import { PageCalendarPagedCaption } from "../../../StyledComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";
import { LOCALE, MAX_YEAR, MIN_YEAR, TODAY } from "../CalendarPage.const";
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
            monthSignal={props.monthSignal}
        />

        <Calendar
            precision={"year"}
            valueSignal={props.valueSignal}
            monthSignal={props.monthSignal}
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
