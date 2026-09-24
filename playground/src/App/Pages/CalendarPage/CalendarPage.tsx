import type { Signal } from "solid-js";
import { createMemo, createSignal } from "solid-js";

import type { DateValue, DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components";

import { CalendarKnobs } from "../../Knobs/Calendars.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageSelectField } from "../../StyledComponents/Field/Field";
import { MAX_DATE, MAX_YEAR, MIN_DATE, MIN_YEAR, TODAY, WEEK_START_LABELS } from "./CalendarPage.const";
import { BoundedExample } from "./Examples/Bounded";
import { DefaultExample } from "./Examples/Default";
import { MonthPickerExample } from "./Examples/MonthPicker";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { WeekdaysExample } from "./Examples/Weekdays";
import { YearPickerExample } from "./Examples/YearPicker";

const CALENDAR_FIELD_WIDTH = 180;
const EXAMPLES_ROOT = "/src/App/Pages/CalendarPage/Examples";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

export const CalendarPage = () => {
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(CalendarKnobs.STARTING_CALENDAR);
    const [getWeekStartsOn, setWeekStartsOn] = createSignal<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

    const defaultValue = createSignal<DateValue | undefined>(TODAY);
    const rangedValue = createSignal<DateValue | undefined>();
    const weekdaysValue = createSignal<DateValue | undefined>();
    const rightToLeftValue = createSignal<DateValue | undefined>(TODAY);

    const makeMonthSignal = (): Signal<DateValue> => {
        const signal = createSignal<DateValue>(DateValueUtils.getStartOfMonth(TODAY));

        return [() => DateValueUtils.withCalendar(signal[0](), getCalendarId()), signal[1]];
    };

    const defaultMonth = makeMonthSignal();
    const rangedMonth = makeMonthSignal();
    const weekdaysMonth = makeMonthSignal();
    const rightToLeftMonth = makeMonthSignal();

    const monthPickerValue = createSignal<DateValue | undefined>();
    const yearPickerValue = createSignal<DateValue | undefined>();
    const monthPickerPage = makeMonthSignal();
    const yearPickerPage = makeMonthSignal();

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultValue[0]())} — month: ${describe(defaultMonth[0]())}`,
            component: () => (
                <DefaultExample valueSignal={defaultValue} monthSignal={defaultMonth} weekStartsOn={getWeekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `min ${describe(MIN_DATE)}, max ${describe(MAX_DATE)} — value: ${describe(rangedValue[0]())}`,
            component: () => (
                <BoundedExample valueSignal={rangedValue} monthSignal={rangedMonth} weekStartsOn={getWeekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/Bounded.tsx`,
        },
        {
            key: "weekdays",
            name: "Weekdays only",
            readout: () =>
                `week starts on ${WEEK_START_LABELS[getWeekStartsOn()]} — value: ${describe(weekdaysValue[0]())}`,
            component: () => (
                <WeekdaysExample
                    valueSignal={weekdaysValue}
                    monthSignal={weekdaysMonth}
                    weekStartsOn={getWeekStartsOn}
                />
            ),
            path: `${EXAMPLES_ROOT}/Weekdays.tsx`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${describe(rightToLeftValue[0]())} — the box around the calendar sets dir="rtl", so each week runs from the right and the right arrow moves to the day before`,
            component: () => (
                <RightToLeftExample
                    valueSignal={rightToLeftValue}
                    monthSignal={rightToLeftMonth}
                    weekStartsOn={getWeekStartsOn}
                />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "monthPicker",
            name: "Month picker",
            readout: () =>
                `value: ${describe(monthPickerValue[0]())} — precision="month": the grid holds the year's months, a pick sets the first of the month, and the page keys step a year`,
            component: () => <MonthPickerExample valueSignal={monthPickerValue} monthSignal={monthPickerPage} />,
            path: `${EXAMPLES_ROOT}/MonthPicker.tsx`,
        },
        {
            key: "yearPicker",
            name: "Year picker",
            readout: () =>
                `value: ${describe(yearPickerValue[0]())} — precision="year": twelve years to a page, bounded to ${MIN_YEAR.year}–${MAX_YEAR.year}, and a pick sets the first day of the year`,
            component: () => <YearPickerExample valueSignal={yearPickerValue} monthSignal={yearPickerPage} />,
            path: `${EXAMPLES_ROOT}/YearPicker.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"calendarId"}
                    label={"Calendar"}
                    hint={"Which calendar system the dates are read and written in, such as Gregorian or Islamic."}
                >
                    <PageSelectField
                        value={getCalendarId}
                        values={DateValueUtils.getCalendarIds}
                        width={() => CALENDAR_FIELD_WIDTH}
                        ariaLabel={"Calendar system"}
                        onChange={(id) => setCalendarId(() => id)}
                    />
                </PageProp>

                <PageProp
                    key={"weekStartsOn"}
                    label={"Week starts on"}
                    hint={"Which day begins a week, which decides the order of the column headings."}
                >
                    <PageSelectField
                        value={getWeekStartsOn}
                        values={() => [...CalendarKnobs.WEEK_STARTS]}
                        ariaLabel={"Week starts on"}
                        computeLabel={(day) => WEEK_START_LABELS[day]}
                        onChange={(day) => setWeekStartsOn(() => day)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} minColumnWidth={400} />
        </>
    );
};
