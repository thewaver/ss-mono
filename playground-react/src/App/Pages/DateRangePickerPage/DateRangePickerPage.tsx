import { useState } from "react";

import type { DateValueCalendarId, DateValueRange } from "@thewaver/ss-components-react";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import { MAX_DATE, MIN_DATE } from "@thewaver/ss-playground/App/Pages/CalendarPage/CalendarPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PickedExample } from "./Examples/Picked";

const CALENDAR_FIELD_WIDTH = 180;
const EXAMPLES_ROOT = "/src/App/Pages/DateRangePickerPage/Examples";

const describe = (value: DateValueRange | undefined) =>
    value ? `${DateValueUtils.toIso(value.start)} to ${DateValueUtils.toIso(value.end)}` : "none";

export const DateRangePickerPage = () => {
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    const defaultValue = useState<DateValueRange | undefined>();
    const boundedValue = useState<DateValueRange | undefined>();

    const examples = [
        {
            key: "picked",
            name: "Two fields, one value",
            readout: () => `value: ${describe(defaultValue[0])}`,
            component: () => <PickedExample valueState={defaultValue} calendar={calendarId} itemKey={"picked"} />,
            path: `${EXAMPLES_ROOT}/Picked.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `min ${DateValueUtils.toIso(MIN_DATE)}, max ${DateValueUtils.toIso(MAX_DATE)} — value: ${describe(boundedValue[0])}`,
            component: () => (
                <PickedExample
                    valueState={boundedValue}
                    calendar={calendarId}
                    itemKey={"bounded"}
                    minValue={MIN_DATE}
                    maxValue={MAX_DATE}
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
                        values={DateValueUtils.getCalendarIds()}
                        width={CALENDAR_FIELD_WIDTH}
                        ariaLabel={"Calendar system"}
                        onChange={setCalendarId}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} minColumnWidth={520} />
        </>
    );
};
