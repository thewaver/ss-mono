import { createSignal } from "solid-js";

import type { DateTimeValue } from "@thewaver/ss-components-solid";
import { DateTimePicker } from "@thewaver/ss-components-solid";
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
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import { PageDateTimeSeparator } from "../DateTimePickerPage.content";
import type { DateTimePickerTooltipDocsExampleProps } from "../DateTimePickerPageSolid.types";

type Props = DateTimePickerTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const valueSignal = createSignal<DateTimeValue | undefined>();

    return (
        <DateTimePicker
            value={valueSignal}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
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
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={PAIR_FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderSeparator={() => <PageDateTimeSeparator />}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        A tooltip on a date and time picker.
                    </PageTooltipContent>
                ),
            })}
            triggerId={"tooltipDateTrigger"}
            triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
            renderTrigger={(getFlags) => <PageDatePickerTrigger flags={getFlags} />}
            renderDay={(_unused, getRenderProps) => <PageCalendarDay renderProps={getRenderProps} />}
            renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            renderPopup={(renderCalendar, monthSignal) => (
                <PageCalendarFrame>
                    <PageCalendarCaption month={monthSignal} key={"tooltip"} locale={LOCALE} />

                    {renderCalendar()}
                </PageCalendarFrame>
            )}
            timeTriggerId={"tooltipTimeTrigger"}
            timeTriggerAriaLabel={CLOCK_TRIGGER_LABEL}
            renderTimeTrigger={(getFlags) => <PageTimePickerTrigger flags={getFlags} />}
            renderOption={(_unused, getRenderProps) => <PageClockOption renderProps={getRenderProps} />}
            renderUnit={(name) => <PageClockUnit>{name}</PageClockUnit>}
            renderColumn={(renderOptions) => <PageClockColumn>{renderOptions()}</PageClockColumn>}
            renderTimePopup={(renderClock) => <PageClockFrame>{renderClock()}</PageClockFrame>}
        />
    );
};
