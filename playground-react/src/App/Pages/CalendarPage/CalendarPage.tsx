import { useState } from "react";

import type { DateValue, DateValueCalendarId, DateValueWeekStart } from "@thewaver/ss-components-react";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import { CalendarKnobs } from "@thewaver/ss-playground/App/Knobs/Calendars.const";
import {
    MAX_DATE,
    MAX_YEAR,
    MIN_DATE,
    MIN_YEAR,
    TODAY,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BoundedExample } from "./Examples/Bounded";
import { DefaultExample } from "./Examples/Default";
import { MonthPickerExample } from "./Examples/MonthPicker";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { WeekdaysExample } from "./Examples/Weekdays";
import { YearPickerExample } from "./Examples/YearPicker";

const CALENDAR_FIELD_WIDTH = 180;
const EXAMPLES_ROOT = "/src/App/Pages/CalendarPage/Examples";
const CALENDAR_IDS = DateValueUtils.getCalendarIds();
const WEEK_STARTS: DateValueWeekStart[] = [...CalendarKnobs.WEEK_STARTS];

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const useMonthState = (calendarId: DateValueCalendarId) => {
    const [month, setMonth] = useState<DateValue>(() => DateValueUtils.getStartOfMonth(TODAY));

    return [DateValueUtils.withCalendar(month, calendarId), setMonth] as const;
};

export const CalendarPage = () => {
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(CalendarKnobs.STARTING_CALENDAR);
    const [weekStartsOn, setWeekStartsOn] = useState<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

    const defaultValue = useState<DateValue | undefined>(TODAY);
    const rangedValue = useState<DateValue | undefined>();
    const weekdaysValue = useState<DateValue | undefined>();
    const rightToLeftValue = useState<DateValue | undefined>(TODAY);

    const defaultMonth = useMonthState(calendarId);
    const rangedMonth = useMonthState(calendarId);
    const weekdaysMonth = useMonthState(calendarId);
    const rightToLeftMonth = useMonthState(calendarId);

    const monthPickerValue = useState<DateValue | undefined>();
    const yearPickerValue = useState<DateValue | undefined>();
    const monthPickerPage = useMonthState(calendarId);
    const yearPickerPage = useMonthState(calendarId);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultValue[0])} — month: ${describe(defaultMonth[0])}`,
            component: () => <DefaultExample value={defaultValue} month={defaultMonth} weekStartsOn={weekStartsOn} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () => `min ${describe(MIN_DATE)}, max ${describe(MAX_DATE)} — value: ${describe(rangedValue[0])}`,
            component: () => <BoundedExample value={rangedValue} month={rangedMonth} weekStartsOn={weekStartsOn} />,
            path: `${EXAMPLES_ROOT}/Bounded.tsx`,
        },
        {
            key: "weekdays",
            name: "Weekdays only",
            readout: () => `week starts on ${WEEK_START_LABELS[weekStartsOn]} — value: ${describe(weekdaysValue[0])}`,
            component: () => (
                <WeekdaysExample value={weekdaysValue} month={weekdaysMonth} weekStartsOn={weekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/Weekdays.tsx`,
        },
        {
            key: "rightToLeft",
            name: "In a right-to-left box",
            readout: () =>
                `value: ${describe(rightToLeftValue[0])} — the box around the calendar sets dir="rtl", so each week runs from the right and the right arrow moves to the day before`,
            component: () => (
                <RightToLeftExample value={rightToLeftValue} month={rightToLeftMonth} weekStartsOn={weekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "monthPicker",
            name: "Month picker",
            readout: () =>
                `value: ${describe(monthPickerValue[0])} — precision="month": the grid holds the year's months, a pick sets the first of the month, and the page keys step a year`,
            component: () => <MonthPickerExample value={monthPickerValue} month={monthPickerPage} />,
            path: `${EXAMPLES_ROOT}/MonthPicker.tsx`,
        },
        {
            key: "yearPicker",
            name: "Year picker",
            readout: () =>
                `value: ${describe(yearPickerValue[0])} — precision="year": twelve years to a page, bounded to ${MIN_YEAR.year}–${MAX_YEAR.year}, and a pick sets the first day of the year`,
            component: () => <YearPickerExample value={yearPickerValue} month={yearPickerPage} />,
            path: `${EXAMPLES_ROOT}/YearPicker.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"calendarId"}
                    label={"Calendar"}
                    hint={"Which calendar system the dates are read and written in, such as Gregorian or Islamic."}
                >
                    <PageSelectField
                        value={calendarId}
                        values={CALENDAR_IDS}
                        width={CALENDAR_FIELD_WIDTH}
                        ariaLabel={"Calendar system"}
                        onChange={(id) => setCalendarId(id)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"weekStartsOn"}
                    label={"Week starts on"}
                    hint={"Which day begins a week, which decides the order of the column headings."}
                >
                    <PageSelectField
                        value={weekStartsOn}
                        values={WEEK_STARTS}
                        ariaLabel={"Week starts on"}
                        computeLabel={(day) => WEEK_START_LABELS[day]}
                        onChange={(day) => setWeekStartsOn(day)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={400} />
        </>
    );
};
