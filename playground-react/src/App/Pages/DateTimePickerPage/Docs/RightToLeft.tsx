import { useState } from "react";

import type { DateTimeValue } from "@thewaver/ss-components-react";
import { DateTimePicker } from "@thewaver/ss-components-react";
import {
    CALENDAR_TRIGGER_LABEL,
    CLOCK_TRIGGER_LABEL,
    DATE_PART_HINTS,
    TIME_SEGMENT_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { LOCALE, PAIR_FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import {
    PageClockColumn,
    PageClockFrame,
    PageClockOption,
    PageClockUnit,
} from "../../../StyledComponents/ClockContent/ClockContent";
import { PageDatePickerTrigger } from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PageTimePickerTrigger } from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger";
import { PageDateTimeSeparator } from "../DateTimePickerPage.content";

export const RightToLeftDocsExample = () => {
    const valueState = useState<DateTimeValue | undefined>();

    return (
        <div dir={"rtl"}>
            <DateTimePicker
                value={valueState}
                dateLabel={"Date"}
                timeLabel={"Time"}
                calendarLabel={"Choose a date"}
                clockLabel={"Choose a time"}
                partHints={DATE_PART_HINTS}
                segmentHints={TIME_SEGMENT_HINTS}
                locale={LOCALE}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={PAIR_FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
                renderSeparator={() => <PageDateTimeSeparator />}
                triggerId={"rightToLeftDateTrigger"}
                triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
                renderTrigger={(flags) => <PageDatePickerTrigger flags={flags} />}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderPopup={(renderCalendar, monthState) => (
                    <PageCalendarFrame>
                        <PageCalendarCaption month={monthState} itemKey={"rightToLeft"} locale={LOCALE} />

                        {renderCalendar()}
                    </PageCalendarFrame>
                )}
                timeTriggerId={"rightToLeftTimeTrigger"}
                timeTriggerAriaLabel={CLOCK_TRIGGER_LABEL}
                renderTimeTrigger={(flags) => <PageTimePickerTrigger flags={flags} />}
                renderOption={(_unused, renderProps) => <PageClockOption renderProps={renderProps} />}
                renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
                renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
                renderTimePopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
            />
        </div>
    );
};
