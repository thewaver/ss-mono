import { useState } from "react";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-react";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import { CAESAR, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { TypedExample } from "./Examples/Typed";

const CALENDAR_FIELD_WIDTH = 180;
const CALENDAR_IDS = DateValueUtils.getCalendarIds();
const EXAMPLES_ROOT = "/src/App/Pages/DateInputPage/Examples";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

export const DateInputPage = () => {
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    const typedState = useState<DateValue | undefined>(TODAY);
    const localeState = useState<DateValue | undefined>(TODAY);
    const eraState = useState<DateValue | undefined>(CAESAR);

    const examples = [
        {
            key: "typed",
            name: "Typed only",
            readout: () =>
                `value: ${describe(typedState[0])} — a half-typed or impossible date leaves this value alone`,
            component: () => <TypedExample valueState={typedState} calendar={calendarId} ariaLabel={"Start date"} />,
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "locale",
            name: "Day first",
            readout: () =>
                `value: ${describe(localeState[0])} — dd/mm/yyyy, and the separators are the mask's rather than yours to type`,
            component: () => (
                <TypedExample
                    valueState={localeState}
                    calendar={calendarId}
                    format={"day-month-year"}
                    ariaLabel={"Day-first date"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "era",
            name: "Before the common era",
            readout: () =>
                `value: ${describe(eraState[0])} — the era is a control in the leading slot, offering whatever the calendar reports`,
            component: () => <TypedExample valueState={eraState} calendar={calendarId} ariaLabel={"Historical date"} />,
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
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
                        ariaLabel={"Calendar"}
                        onChange={(id) => setCalendarId(id)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
