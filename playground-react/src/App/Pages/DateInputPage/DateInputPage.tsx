import { useState } from "react";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-react";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-react";
import {
    CALENDAR_FIELD_WIDTH,
    CALENDAR_IDS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/DateInputPage/DateInputPage.const";
import { CAESAR, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { TypedExample } from "./Examples/Typed";

const describe = (value: DateValue | undefined) => (value ? DateValueUtils.toIso(value) : "none");

export const DateInputPage = () => {
    const [calendarId, setCalendarId] = useState<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    const typedState = useState<DateValue | undefined>(TODAY);
    const localeState = useState<DateValue | undefined>(TODAY);
    const eraState = useState<DateValue | undefined>(CAESAR);

    const examples = [
        {
            key: "typed",
            name: EXAMPLE_NAMES.typed,
            readout: () =>
                `value: ${describe(typedState[0])} — a half-typed or impossible date leaves this value alone`,
            component: () => <TypedExample value={typedState} calendar={calendarId} ariaLabel={"Start date"} />,
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "locale",
            name: EXAMPLE_NAMES.locale,
            readout: () =>
                `value: ${describe(localeState[0])} — dd/mm/yyyy, and the separators are the mask's rather than yours to type`,
            component: () => (
                <TypedExample
                    value={localeState}
                    calendar={calendarId}
                    format={"day_month_year"}
                    ariaLabel={"Day-first date"}
                />
            ),
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "era",
            name: EXAMPLE_NAMES.era,
            readout: () =>
                `value: ${describe(eraState[0])} — the era is a control in the leading slot, offering whatever the calendar reports`,
            component: () => <TypedExample value={eraState} calendar={calendarId} ariaLabel={"Historical date"} />,
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
                    controls={"Sets DateInputProps.calendar"}
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
