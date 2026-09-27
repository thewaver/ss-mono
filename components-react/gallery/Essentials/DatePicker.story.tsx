import { useState } from "react";

import {
    type CalendarPrecision,
    CalendarUtils,
    type DateValue,
    DateValueUtils,
    type InteractionFlags,
    type TextFieldFlags,
} from "@thewaver/ss-components";

import { DatePicker } from "../../src";

const LOCALE = "en-GB";
const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
const PART_HINTS = { year: "yyyy", month: "mm", day: "dd" };
const WEEK_STARTS_ON_MONDAY = 1;
const WEEKEND_OFFSET = 5;
const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;
const MONTH_CELL: Intl.DateTimeFormatOptions = { month: "short" };

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const getIsWeekend = (day: DateValue) => DateValueUtils.getWeekdayOffset(day, WEEK_STARTS_ON_MONDAY) >= WEEKEND_OFFSET;

const renderFrame = (flags: InteractionFlags<TextFieldFlags>) => (
    <div
        style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

type ExampleProps = {
    initial?: DateValue;
    isDisabled?: boolean;
    precision?: CalendarPrecision;
    minValue?: DateValue;
    maxValue?: DateValue;
    computeIsDayDisabled?: (day: DateValue) => boolean;
};

const Example = (props: ExampleProps) => {
    const valueState = useState<DateValue | undefined>(props.initial);
    const precision = props.precision ?? "day";

    return (
        <>
            <input data-testid="elsewhere" aria-label="Elsewhere" />
            <DatePicker
                id="field"
                valueState={valueState}
                minValue={props.minValue}
                maxValue={props.maxValue}
                isDisabled={props.isDisabled}
                precision={props.precision}
                computeIsDayDisabled={props.computeIsDayDisabled}
                ariaLabel="Date"
                calendarLabel="Choose a date"
                partHints={PART_HINTS}
                locale={LOCALE}
                padding={FIELD_PADDING}
                renderContent={renderFrame}
                triggerId="trigger"
                triggerAriaLabel="Open the calendar"
                renderTrigger={(flags) => <span>{flags.isOpen ? "Close" : "Open"}</span>}
                renderDay={(day) => (
                    <span>{precision === "day" ? day.day : DateValueUtils.format(day, MONTH_CELL, LOCALE)}</span>
                )}
                renderWeekday={(name) => <span>{name}</span>}
                renderPopup={(renderCalendar, [month, setMonth]) => (
                    <div style={{ background: "white" }}>
                        <button
                            type="button"
                            id="previousPage"
                            onClick={() => setMonth(CalendarUtils.stepPage(month, precision, -1))}
                        >
                            Previous
                        </button>
                        <span data-testid="page">{describe(month)}</span>
                        <button
                            type="button"
                            id="nextPage"
                            onClick={() => setMonth(CalendarUtils.stepPage(month, precision, 1))}
                        >
                            Next
                        </button>
                        {renderCalendar()}
                    </div>
                )}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
        </>
    );
};

export const Picked = (props: { isDisabled?: boolean }) => <Example isDisabled={props.isDisabled} />;

export const Bounded = () => <Example minValue={MIN_DATE} maxValue={MAX_DATE} />;

export const Weekdays = () => <Example computeIsDayDisabled={getIsWeekend} />;

export const MonthPrecision = () => <Example precision="month" />;
