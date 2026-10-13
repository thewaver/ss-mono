import { useState } from "react";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-react";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import {
    CALENDAR_FIELD_WIDTH,
    CALENDAR_IDS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    MAX_DATE,
    MIN_DATE,
    WEEKEND_OFFSET,
    WEEK_STARTS_ON_MONDAY,
} from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PickedExample } from "./Examples/Picked";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

const getIsWeekend = (day: DateValue) => DateValueUtils.getWeekdayOffset(day, WEEK_STARTS_ON_MONDAY) >= WEEKEND_OFFSET;

export const DatePickerPage = () => {
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    const pickedState = useState<DateValue | undefined>();
    const boundedState = useState<DateValue | undefined>();
    const weekdayState = useState<DateValue | undefined>();
    const monthState = useState<DateValue | undefined>();

    const examples = [
        {
            key: "picked",
            name: EXAMPLE_NAMES.picked,
            readout: () => `value: ${describe(pickedState[0])} — typing and picking write the same signal`,
            component: () => <PickedExample value={pickedState} calendar={calendarId} itemKey={"picked"} />,
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "bounded",
            name: EXAMPLE_NAMES.bounded,
            readout: () =>
                `value: ${describe(boundedState[0])} — ${DateValueUtils.toIso(MIN_DATE)} to ${DateValueUtils.toIso(MAX_DATE)}, typed or picked`,
            component: () => (
                <PickedExample
                    value={boundedState}
                    calendar={calendarId}
                    itemKey={"bounded"}
                    minValue={MIN_DATE}
                    maxValue={MAX_DATE}
                />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "weekdays",
            name: EXAMPLE_NAMES.weekdays,
            readout: () =>
                `value: ${describe(weekdayState[0])} — the calendar refuses a weekend, and typing one reports it as an error`,
            component: () => (
                <PickedExample
                    value={weekdayState}
                    calendar={calendarId}
                    itemKey={"weekdays"}
                    computeIsDayDisabled={getIsWeekend}
                />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "monthPrecision",
            name: EXAMPLE_NAMES.monthPrecision,
            readout: () =>
                `value: ${describe(monthState[0])} — precision="month" is handed to the calendar, so a pick there sets the first of the month; the field still takes a whole date`,
            component: () => (
                <PickedExample
                    value={monthState}
                    calendar={calendarId}
                    itemKey={"monthPrecision"}
                    precision={"month"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
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
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
