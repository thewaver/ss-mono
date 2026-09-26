import { Show } from "solid-js";

import type {
    CalendarPrecision,
    DateInputEra,
    DateValue,
    InteractionFlags,
    MaybeAccessor,
    TextFieldFlags,
} from "@thewaver/ss-components";
import { DatePicker, DateValueUtils, access } from "@thewaver/ss-components";

import { CALENDAR_TRIGGER_LABEL, DATE_PART_HINTS } from "../../../PageComponents/Announcements/Announcements.const";
import { PageCalendarCaption } from "../../../PageComponents/CalendarCaption/CalendarCaption";
import { PageCalendarPagedCaption } from "../../../PageComponents/CalendarCaption/CalendarPagedCaption";
import { PageEraCycle } from "../../../PageComponents/EraCycle/EraCycle";
import {
    PageCalendarCell,
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
import { FIELD_WIDTH, LOCALE } from "../DatePickerPage.const";
import type { DateExampleProps } from "../DatePickerPage.types";

import { FIELD_GAP, FIELD_STEPPER_PADDING } from "../../../StyledComponents/TextFieldContent/TextFieldContent.css";

const MONTH_CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

type Props = DateExampleProps & {
    key: MaybeAccessor<string>;
    precision?: MaybeAccessor<CalendarPrecision>;
    minValue?: MaybeAccessor<DateValue>;
    maxValue?: MaybeAccessor<DateValue>;
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

export const PickedExample = (props: Props) => {
    const getIsMonthPrecision = () => access(props.precision) === "month";

    return (
        <DatePicker
            valueSignal={props.valueSignal}
            calendar={props.calendar}
            minValue={props.minValue}
            maxValue={props.maxValue}
            computeIsDayDisabled={props.computeIsDayDisabled}
            precision={props.precision}
            ariaLabel={"Date"}
            calendarLabel={"Choose a date"}
            partHints={DATE_PART_HINTS}
            locale={() => LOCALE}
            padding={() => FIELD_STEPPER_PADDING}
            gap={() => FIELD_GAP}
            computeTextStyle={computePageTextFieldTextStyle}
            renderContent={(getFlags) => <PageTextFieldContent flags={getFlags} width={() => FIELD_WIDTH} />}
            renderPlaceholder={(getFlags, hint) => (
                <PageTextFieldPlaceholder flags={getFlags}>{hint}</PageTextFieldPlaceholder>
            )}
            renderLeading={(getFlags: () => InteractionFlags<TextFieldFlags>, era: DateInputEra) => (
                <PageEraCycle
                    era={era.getValue}
                    options={era.getOptions}
                    isDisabled={() => getFlags().isDisabled ?? false}
                    onChange={era.set}
                />
            )}
            triggerId={() => `${access(props.key)}Trigger`}
            triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
            renderTrigger={(getFlags) => <PageDatePickerTrigger flags={getFlags} />}
            renderDay={(getDay, getRenderProps) => (
                <Show when={getIsMonthPrecision()} fallback={<PageCalendarDay renderProps={getRenderProps} />}>
                    <PageCalendarCell renderProps={getRenderProps}>
                        {DateValueUtils.format(getDay(), MONTH_CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                </Show>
            )}
            renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            renderPopup={(renderCalendar, monthSignal) => (
                <PageCalendarFrame>
                    <Show
                        when={getIsMonthPrecision()}
                        fallback={
                            <PageCalendarCaption monthSignal={monthSignal} key={props.key} locale={() => LOCALE} />
                        }
                    >
                        <PageCalendarPagedCaption
                            key={props.key}
                            locale={LOCALE}
                            precision={"month"}
                            previousLabel={"Previous year"}
                            nextLabel={"Next year"}
                            monthSignal={monthSignal}
                        />
                    </Show>

                    {renderCalendar()}
                </PageCalendarFrame>
            )}
        />
    );
};
