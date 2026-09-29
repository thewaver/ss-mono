import type {
    CalendarPrecision,
    DateInputEra,
    DateValue,
    InteractionFlags,
    TextFieldFlags,
} from "@thewaver/ss-components-react";
import { DatePicker, DateValueUtils } from "@thewaver/ss-components-react";
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
import type { DateExampleProps } from "../DatePickerPage.types";

const MONTH_CELL_OPTIONS: Intl.DateTimeFormatOptions = { month: "short" };

type Props = DateExampleProps & {
    itemKey: string;
    precision?: CalendarPrecision;
    minValue?: DateValue;
    maxValue?: DateValue;
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

export const PickedExample = (props: Props) => {
    const isMonthPrecision = props.precision === "month";

    return (
        <DatePicker
            value={props.value}
            calendar={props.calendar}
            minValue={props.minValue}
            maxValue={props.maxValue}
            computeIsDayDisabled={props.computeIsDayDisabled}
            precision={props.precision}
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
            renderLeading={(flags: InteractionFlags<TextFieldFlags>, era: DateInputEra) => (
                <PageEraCycle
                    era={era.value}
                    options={era.options}
                    isDisabled={flags.isDisabled ?? false}
                    onChange={era.set}
                />
            )}
            triggerId={`${props.itemKey}Trigger`}
            triggerAriaLabel={CALENDAR_TRIGGER_LABEL}
            renderTrigger={(flags) => <PageDatePickerTrigger flags={flags} />}
            renderDay={(day, renderProps) =>
                isMonthPrecision ? (
                    <PageCalendarCell renderProps={renderProps}>
                        {DateValueUtils.format(day, MONTH_CELL_OPTIONS, LOCALE)}
                    </PageCalendarCell>
                ) : (
                    <PageCalendarDay renderProps={renderProps} />
                )
            }
            renderWeekday={(name) => <PageCalendarWeekday>{name}</PageCalendarWeekday>}
            renderPopup={(renderCalendar, monthState) => (
                <PageCalendarFrame>
                    {isMonthPrecision ? (
                        <PageCalendarPagedCaption
                            itemKey={props.itemKey}
                            locale={LOCALE}
                            precision={"month"}
                            previousLabel={"Previous year"}
                            nextLabel={"Next year"}
                            month={monthState}
                        />
                    ) : (
                        <PageCalendarCaption month={monthState} itemKey={props.itemKey} locale={LOCALE} />
                    )}

                    {renderCalendar()}
                </PageCalendarFrame>
            )}
        />
    );
};
