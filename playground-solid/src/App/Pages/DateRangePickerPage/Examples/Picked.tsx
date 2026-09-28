import type { DateValue, MaybeAccessor } from "@thewaver/ss-components-solid";
import { DateRangePicker, access } from "@thewaver/ss-components-solid";
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
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { PageDateRangeSeparator } from "../DateRangePickerPage.content";
import type { DateRangeExampleProps } from "../DateRangePickerPage.types";

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
