import { useMemo, useState } from "react";

import type { DateValue, DateValueCalendarId, DateValueRange, DateValueWeekStart } from "@thewaver/ss-components-react";
import { CALENDAR_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import { RangeCalendarKnobs } from "@thewaver/ss-playground-core/App/Knobs/RangeCalendars.const";
import {
    MAX_DATE,
    MIN_DATE,
    TODAY,
    WEEK_START_LABELS,
} from "@thewaver/ss-playground-core/App/Pages/CalendarPage/CalendarPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { BoundedExample } from "./Examples/Bounded";
import { DefaultExample } from "./Examples/Default";

const CALENDAR_FIELD_WIDTH = 180;
const CALENDAR_IDS = DateValueUtils.getCalendarIds();
const EXAMPLES_ROOT = "/src/App/Pages/RangeCalendarPage/Examples";

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

    const defaultMonth = useMonthState(calendarId);
    const boundedMonth = useMonthState(calendarId);

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () => `value: ${describe(defaultValue[0])}`,
            component: () => (
                <DefaultExample valueState={defaultValue} monthState={defaultMonth} weekStartsOn={weekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue[0])}`,
            component: () => (
                <BoundedExample valueState={boundedValue} monthState={boundedMonth} weekStartsOn={weekStartsOn} />
            ),
            path: `${EXAMPLES_ROOT}/Bounded.tsx`,
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
