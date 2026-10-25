import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { DatePicker, DateValueUtils } from "@thewaver/ss-components-react";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageCalendarCell, PageCalendarFrame } from "../../../StyledComponents/CalendarContent/CalendarContent";
import { PageDatePickerTrigger } from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

const MONTH_CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

export const MonthPickerDocsExample = () => {
    const valueState = useState<DateValue | undefined>();

    const valueText = valueState[0] ? DateValueUtils.toIso(valueState[0]) : "nothing";

    return (
        <>
            <DatePicker
                value={valueState}
                precision={"month"}
                ariaLabel={"Month"}
                calendarLabel={"Choose a month"}
                partHints={DATE_PART_HINTS}
                locale={LOCALE}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
                triggerId={"monthPickerTrigger"}
                triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
                renderTrigger={(flags) => <PageDatePickerTrigger flags={flags} />}
                renderDay={(day, renderProps) => (
                    <PageCalendarCell renderProps={renderProps}>
                        {DateValueUtils.format(day, MONTH_CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                )}
                renderPopup={(renderCalendar, monthState) => (
                    <PageCalendarFrame>
                        <PageCalendarPagedCaption
                            itemKey={"monthPicker"}
                            locale={LOCALE}
                            precision={"month"}
                            previousLabel={"Previous year"}
                            nextLabel={"Next year"}
                            month={monthState}
                        />

                        {renderCalendar()}
                    </PageCalendarFrame>
                )}
            />

            <div className={exampleStyles.exampleReadout} data-readout>
                {`Value: ${valueText}`}
            </div>
        </>
    );
};
