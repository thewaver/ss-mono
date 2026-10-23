import { useMemo, useState } from "react";

import type { DateValue, DateValueCalendarId, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-react";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import { RangeCalendarKnobs } from "@thewaver/ss-playground/App/Knobs/RangeCalendars.const";
import {
    MAX_DATE,
    MIN_DATE,
    TODAY,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";
import {
    CALENDAR_FIELD_WIDTH,
    CALENDAR_IDS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/RangeCalendarPage/RangeCalendarPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BoundedExample } from "./Examples/Bounded";
import { DefaultExample } from "./Examples/Default";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { TwoMonthsExample } from "./Examples/TwoMonths";

const describe = (value: DateValueRange | undefined) =>
    value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "none";

const useMonthState = (calendarId: DateValueCalendarId) => {
    const [month, setMonth] = useState<DateValue>(() => DateValueUtils.getStartOfMonth(TODAY));

    const calendarMonth = useMemo(() => DateValueUtils.withCalendar(month, calendarId), [month, calendarId]);

    return [calendarMonth, setMonth] as const;
};

export const RangeCalendarPage = () => {
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(RangeCalendarKnobs.STARTING_CALENDAR);
    const [weekStartsOn, setWeekStartsOn] = useState<DateValueWeekStart>(CALENDAR_DEFAULTS.weekStartsOn);

    const defaultValue = useState<DateValueRange | undefined>();
    const boundedValue = useState<DateValueRange | undefined>();
    const rightToLeftValue = useState<DateValueRange | undefined>();
    const twoMonthsValue = useState<DateValueRange | undefined>();

    const defaultMonth = useMonthState(calendarId);
    const boundedMonth = useMonthState(calendarId);
    const rightToLeftMonth = useMonthState(calendarId);
    const twoMonthsMonth = useMonthState(calendarId);

    const examples = [
        {
            key: "default",
            name: EXAMPLE_NAMES.default,
            readout: () => `value: ${describe(defaultValue[0])}`,
            component: () => <DefaultExample value={defaultValue} month={defaultMonth} weekStartsOn={weekStartsOn} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "bounded",
            name: EXAMPLE_NAMES.bounded,
            readout: () =>
                `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue[0])}`,
            component: () => <BoundedExample value={boundedValue} month={boundedMonth} weekStartsOn={weekStartsOn} />,
            path: `${EXAMPLES_ROOT}/Bounded.tsx`,
        },
        {
            key: "twoMonths",
            name: EXAMPLE_NAMES.twoMonths,
            readout: () =>
                `value: ${describe(twoMonthsValue[0])} — a range can start in one month and end in the other; the arrow keys walk across, and the page keys step both`,
            component: () => (
                <TwoMonthsExample value={twoMonthsValue} month={twoMonthsMonth} weekStartsOn={weekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/TwoMonths.tsx`,
        },
        {
            key: "rightToLeft",
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `value: ${describe(rightToLeftValue[0])} — the box around the calendar sets dir="rtl", so a week runs from the right and the left arrow moves on to the next day`,
            component: () => (
                <RightToLeftExample value={rightToLeftValue} month={rightToLeftMonth} weekStartsOn={weekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"calendarId"}
                    label={"Calendar"}
                    hint={"Which calendar system the dates are read and written in, such as Gregorian or Islamic."}
                    controls={"Picks the calendar the example puts on the dates sent to RangeCalendarProps.value"}
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
                    controls={"Sets RangeCalendarProps.weekStartsOn"}
                >
                    <PageSelectField
                        value={weekStartsOn}
                        values={RangeCalendarKnobs.WEEK_STARTS}
                        ariaLabel={"Week starts on"}
                        computeLabel={(day) => WEEK_START_LABELS[day]}
                        onChange={(day) => setWeekStartsOn(day)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
