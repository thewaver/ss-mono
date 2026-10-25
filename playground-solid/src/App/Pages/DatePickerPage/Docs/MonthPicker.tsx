import { createSignal } from "solid-js";

import type { DateValue } from "@thewaver/ss-components-solid";
import { DatePicker, DateValueUtils } from "@thewaver/ss-components-solid";
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
    const valueSignal = createSignal<DateValue | undefined>();

    const getValueText = () => {
        const value = valueSignal[0]();

        return value ? DateValueUtils.toIso(value) : "nothing";
    };

    return (
        <>
            <DatePicker
                value={valueSignal}
                precision={"month"}
                ariaLabel={"Month"}
                calendarLabel={"Choose a month"}
                partHints={DATE_PART_HINTS}
                locale={LOCALE}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={FIELD_WIDTH} />}
                renderPlaceholder={(getFlags, hint) => (
                    <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
                )}
                triggerId={"monthPickerTrigger"}
                triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
                renderTrigger={(getFlags) => <PageDatePickerTrigger flags={getFlags} />}
                renderDay={(getDay, getRenderProps) => (
                    <PageCalendarCell renderProps={getRenderProps}>
                        {DateValueUtils.format(getDay(), MONTH_CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                )}
                renderPopup={(renderCalendar, monthSignal) => (
                    <PageCalendarFrame>
                        <PageCalendarPagedCaption
                            key={"monthPicker"}
                            locale={LOCALE}
                            precision={"month"}
                            previousLabel={"Previous year"}
                            nextLabel={"Next year"}
                            month={monthSignal}
                        />

                        {renderCalendar()}
                    </PageCalendarFrame>
                )}
            />

            <div class={exampleStyles.exampleReadout} data-readout>
                {`Value: ${getValueText()}`}
            </div>
        </>
    );
};
