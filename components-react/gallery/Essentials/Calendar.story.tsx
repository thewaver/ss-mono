import { useMemo, useState } from "react";

import {
    type CalendarPrecision,
    CalendarUtils,
    type DateValue,
    type DateValueCalendarId,
    DateValueUtils,
    type DateValueWeekStart,
} from "@thewaver/ss-components";

import { Calendar } from "../../src";

const LOCALE = "en-GB";
const TODAY = DateValueUtils.fromIso("2026-08-10")!;
const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
const MIN_YEAR = DateValueUtils.fromIso("2019-01-01")!;
const MAX_YEAR = DateValueUtils.fromIso("2031-12-31")!;
const WEEKEND_DAYS = [0, 6];
const DEFAULT_CALENDAR: DateValueCalendarId = "gregory";

const MONTH_CELL: Intl.DateTimeFormatOptions = { month: "short" };
const YEAR_CELL: Intl.DateTimeFormatOptions = { year: "numeric" };

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

type ExampleProps = {
    calendarId?: DateValueCalendarId;
    weekStartsOn?: DateValueWeekStart;
};

const useMonthState = (calendarId: DateValueCalendarId) => {
    const [month, setMonth] = useState(() => DateValueUtils.getStartOfMonth(TODAY));
    const shown = useMemo(() => DateValueUtils.withCalendar(month, calendarId), [month, calendarId]);

    return [shown, setMonth] as const;
};

const Caption = ({
    id,
    precision,
    monthState,
}: {
    id: string;
    precision: CalendarPrecision;
    monthState: readonly [DateValue, (month: DateValue) => void];
}) => {
    const [month, setMonth] = monthState;

    return (
        <div>
            <button
                type="button"
                id={`${id}PreviousMonth`}
                onClick={() => setMonth(CalendarUtils.stepPage(month, precision, -1))}
            >
                Previous
            </button>
            <button
                type="button"
                id={`${id}NextMonth`}
                onClick={() => setMonth(CalendarUtils.stepPage(month, precision, 1))}
            >
                Next
            </button>
        </div>
    );
};

const renderCell =
    (precision: CalendarPrecision) => (day: DateValue, flags: { isSelected: boolean; isOutsideMonth: boolean }) => (
        <span data-selected={flags.isSelected || undefined} data-outside={flags.isOutsideMonth || undefined}>
            {precision === "day"
                ? day.day
                : DateValueUtils.format(day, precision === "month" ? MONTH_CELL : YEAR_CELL, LOCALE)}
        </span>
    );

const Example = (
    props: ExampleProps & {
        id: string;
        initial?: DateValue;
        precision?: CalendarPrecision;
        minValue?: DateValue;
        maxValue?: DateValue;
        computeIsDayDisabled?: (day: DateValue) => boolean;
    },
) => {
    const calendarId = props.calendarId ?? DEFAULT_CALENDAR;
    const precision = props.precision ?? "day";
    const valueState = useState<DateValue | undefined>(props.initial);
    const monthState = useMonthState(calendarId);

    return (
        <div id={props.id}>
            <Caption id={props.id} precision={precision} monthState={monthState} />
            <Calendar
                valueState={valueState}
                monthState={monthState}
                precision={props.precision}
                today={TODAY}
                locale={LOCALE}
                weekStartsOn={props.weekStartsOn}
                minValue={props.minValue}
                maxValue={props.maxValue}
                computeIsDayDisabled={props.computeIsDayDisabled}
                ariaLabel="Choose a date"
                renderDay={renderCell(precision)}
                renderWeekday={(name) => <span>{name}</span>}
            />
            <output data-readout="value">{describe(valueState[0])}</output>
            <output data-readout="month">{describe(monthState[0])}</output>
        </div>
    );
};

export const Default = (props: ExampleProps) => <Example {...props} id="default" initial={TODAY} />;

export const Bounded = (props: ExampleProps) => (
    <Example {...props} id="bounded" minValue={MIN_DATE} maxValue={MAX_DATE} />
);

export const Weekdays = (props: ExampleProps) => (
    <Example
        {...props}
        id="weekdays"
        computeIsDayDisabled={(day) => WEEKEND_DAYS.includes(DateValueUtils.toDate(day).getDay())}
    />
);

export const RightToLeft = (props: ExampleProps) => (
    <div dir="rtl">
        <Example {...props} id="rightToLeft" initial={TODAY} />
    </div>
);

export const MonthPicker = (props: ExampleProps) => <Example {...props} id="monthPicker" precision="month" />;

export const YearPicker = (props: ExampleProps) => (
    <Example {...props} id="yearPicker" precision="year" minValue={MIN_YEAR} maxValue={MAX_YEAR} />
);
