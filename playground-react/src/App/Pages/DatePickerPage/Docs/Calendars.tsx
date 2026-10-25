import { useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { DatePicker, DateValueUtils } from "@thewaver/ss-components-react";
import {
    CALENDAR_TRIGGER_LABEL,
    DATE_PART_HINTS,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import {
    FIELD_GAP,
    FIELD_STEPPER_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import { PageEraCycle } from "../../../PageComponents/EraCycle/EraCycle";
import {
    PageCalendarDay,
    PageCalendarFrame,
    PageCalendarWeekday,
} from "../../../StyledComponents/CalendarContent/CalendarContent";
import { PageDatePickerTrigger } from "../../../StyledComponents/DatePickerTrigger/DatePickerTrigger";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import type { DatePickerCalendarsDocsExampleProps } from "../DatePickerPageReact.types";

type Props = DatePickerCalendarsDocsExampleProps;

export const CalendarsDocsExample = (props: Props) => {
    const valueState = useState<DateValue | undefined>(TODAY);

    const valueText = valueState[0] ? DateValueUtils.toIso(valueState[0]) : "nothing";

    return (
        <>
            <DatePicker
                value={valueState}
                calendar={props.calendar}
                ariaLabel={"Date"}
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
                renderLeading={(flags, era) => (
                    <PageEraCycle
                        era={era.value}
                        options={era.options}
                        isDisabled={flags.isDisabled ?? false}
                        onChange={era.set}
                    />
                )}
                triggerId={"calendarsTrigger"}
                triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
                renderTrigger={(flags) => <PageDatePickerTrigger flags={flags} />}
                renderDay={(_unused, renderProps) => <PageCalendarDay renderProps={renderProps} />}
                renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
                renderPopup={(renderCalendar, monthState) => (
                    <PageCalendarFrame>
                        <PageCalendarCaption month={monthState} itemKey={"calendars"} locale={LOCALE} />

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
