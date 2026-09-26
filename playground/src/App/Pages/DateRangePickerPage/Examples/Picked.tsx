import type { DateValue, MaybeAccessor } from "@thewaver/ss-components";
import { DateRangePicker, access } from "@thewaver/ss-components";

import { CALENDAR_TRIGGER_LABEL, DATE_PART_HINTS } from "../../../PageComponents/Announcements/Announcements.const";
import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
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
import { FIELD_WIDTH, LOCALE } from "../../DatePickerPage/DatePickerPage.const";
import { PageDateRangeSeparator } from "../DateRangePickerPage.content";
import type { DateRangeExampleProps } from "../DateRangePickerPage.types";

import { FIELD_GAP, FIELD_STEPPER_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

type Props = DateRangeExampleProps & {
    key: MaybeAccessor<string>;
    minValue?: MaybeAccessor<DateValue>;
    maxValue?: MaybeAccessor<DateValue>;
};

export const PickedExample = (props: Props) => {
    return (
        <DateRangePicker
            valueSignal={props.valueSignal}
            calendar={props.calendar}
            minValue={props.minValue}
            maxValue={props.maxValue}
            startLabel={"Start date"}
            endLabel={"End date"}
            calendarLabel={"Choose a date range"}
            partHints={DATE_PART_HINTS}
            locale={() => LOCALE}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderSeparator={() => <PageDateRangeSeparator />}
            triggerId={() => `${access(props.key)}Trigger`}
            triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
            renderTrigger={(getFlags) => <PageDatePickerTrigger flags={getFlags} />}
            renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
            renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            renderPopup={(renderCalendar, monthSignal) => (
                <PageCalendarFrame>
                    <PageCalendarCaption monthSignal={monthSignal} key={props.key} locale={() => LOCALE} />

                    {renderCalendar()}
                </PageCalendarFrame>
            )}
        />
    );
};
