import { createMemo, createSignal } from "solid-js";

import type { DateValue, DateValueCalendarId } from "@thewaver/ss-components-solid";
import { DATE_INPUT_DEFAULTS, DateValueUtils } from "@thewaver/ss-components-solid";
import {
    CALENDAR_FIELD_WIDTH,
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
    const [getCalendarId, setCalendarId] = createSignal<DateValueCalendarId>(DATE_INPUT_DEFAULTS.calendar);

    const typedSignal = createSignal<DateValue | undefined>(TODAY);
    const localeSignal = createSignal<DateValue | undefined>(TODAY);
    const eraSignal = createSignal<DateValue | undefined>(CAESAR);

    const getExamples = createMemo(() => [
        {
            key: "typed",
            name: EXAMPLE_NAMES.typed,
            readout: () =>
                `value: ${describe(typedSignal[0]())} — a half-typed or impossible date leaves this value alone`,
            component: () => <TypedExample value={typedSignal} calendar={getCalendarId} ariaLabel={"Start date"} />,
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
        },
        {
            key: "locale",
            name: EXAMPLE_NAMES.locale,
            readout: () =>
                `value: ${describe(localeSignal[0]())} — dd/mm/yyyy, and the separators are the mask's rather than yours to type`,
            component: () => (
                <TypedExample
                    value={localeSignal}
                    calendar={getCalendarId}
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
                `value: ${describe(eraSignal[0]())} — the era is a control in the leading slot, offering whatever the calendar reports`,
            component: () => <TypedExample value={eraSignal} calendar={getCalendarId} ariaLabel={"Historical date"} />,
            path: `${EXAMPLES_ROOT}/Typed.tsx`,
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
                        width={CALENDAR_FIELD_WIDTH}
                        ariaLabel={"Calendar"}
                        onChange={(id) => setCalendarId(() => id)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
