import { createMemo, createSignal } from "solid-js";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { MAX_DATE, MIN_DATE } from "./DatePickerPage.const";
import { PickedExample } from "./Examples/Picked";

const CALENDAR_FIELD_WIDTH = 180;
const WEEK_STARTS_ON_MONDAY = 1;
const WEEKEND_OFFSET = 5;
const EXAMPLES_ROOT = "/src/App/Pages/DatePickerPage/Examples";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const getIsWeekend = (day: DateValue) => DateValueUtils.getWeekdayOffset(day, WEEK_STARTS_ON_MONDAY) >= WEEKEND_OFFSET;

export const DatePickerPage = () => {
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    const pickedSignal = createSignal<DateValue | undefined>();
    const boundedSignal = createSignal<DateValue | undefined>();
    const weekdaySignal = createSignal<DateValue | undefined>();
    const monthSignal = createSignal<DateValue | undefined>();

    const getExamples = createMemo(() => [
        {
            key: "picked",
            name: "With a calendar",
            readout: () => `value: ${describe(pickedSignal[0]())} — typing and picking write the same signal`,
            component: () => <PickedExample valueSignal={pickedSignal} calendar={getCalendarId} key={"picked"} />,
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `value: ${describe(boundedSignal[0]())} — ${DateValueUtils.toIso(MIN_DATE)} to ${DateValueUtils.toIso(MAX_DATE)}, typed or picked`,
            component: () => (
                <PickedExample
                    valueSignal={boundedSignal}
                    calendar={getCalendarId}
                    key={"bounded"}
                    minValue={() => MIN_DATE}
                    maxValue={() => MAX_DATE}
                />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "weekdays",
            name: "Weekdays only",
            readout: () =>
                `value: ${describe(weekdaySignal[0]())} — the calendar refuses a weekend, and typing one reports it as an error`,
            component: () => (
                <PickedExample
                    valueSignal={weekdaySignal}
                    calendar={getCalendarId}
                    key={"weekdays"}
                    computeIsDayDisabled={getIsWeekend}
                />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "monthPrecision",
            name: "Picking a month",
            readout: () =>
                `value: ${describe(monthSignal[0]())} — precision="month" is handed to the calendar, so a pick there sets the first of the month; the field still takes a whole date`,
            component: () => (
                <PickedExample
                    valueSignal={monthSignal}
                    calendar={getCalendarId}
                    key={"monthPrecision"}
                    precision={"month"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
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
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
