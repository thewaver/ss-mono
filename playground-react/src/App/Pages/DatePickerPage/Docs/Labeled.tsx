import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { DatePicker, Label } from "@thewaver/ss-components-react";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
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
import { PageDatePickerTrigger } from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";

const LABEL_GAP = 5;

export const LabeledDocsExample = () => {
    const valueState = useState<DateValue | undefined>();

    return (
        <Label orientation={"vertical"} gap={LABEL_GAP}>
            <PageLabelCaption>Arrival</PageLabelCaption>

            <DatePicker
                value={valueState}
                calendarLabel={"Choose a date"}
                partHints={DATE_PART_HINTS}
                locale={LOCALE}
                padding={FIELD_STEPPER_PADDING}
                gap={FIELD_GAP}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => <PageTextFieldContent flags={flags} width={FIELD_WIDTH} />}
                renderPlaceholder={(flags, hint) => (
                    <PageTextFieldPlaceholder flags={flags}>{hint}</PageTextFieldPlaceholder>
                )}
                triggerId={"labeledTrigger"}
                triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
                renderTrigger={(flags) => <PageDatePickerTrigger flags={flags} />}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderPopup={(renderCalendar, monthState) => (
                    <PageCalendarFrame>
                        <PageCalendarCaption month={monthState} itemKey={"labeled"} locale={LOCALE} />

                        {renderCalendar()}
                    </PageCalendarFrame>
                )}
            />
        </Label>
    );
};
